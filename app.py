import json
import urllib.request
from flask import Flask, render_template, request, redirect, url_for, flash, session
import mysql.connector
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Change this in production

# Database configuration - using environment variables
db_config = {
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', ''),
    'host': os.environ.get('DB_HOST', 'localhost'),
    'database': os.environ.get('DB_NAME', 'treetech_db')
}

def get_db_connection():
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except mysql.connector.Error as err:
        print(f"Error connecting to database: {err}")
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    if request.method == 'POST':
        name = request.form['name']
        phone = request.form['phone']
        email = request.form.get('email')
        experience = request.form.get('experience')
        location = request.form.get('location')

        # --- Send data to n8n Webhook ---
        webhook_url = 'https://n8n.control-app.work/webhook/14fd8c81-e557-4898-8cf3-0720e3321dc0'
        webhook_data = {
            'name': name,
            'phone': phone,
            'email': email,
            'experience': experience,
            'location': location
        }
        try:
            json_data = json.dumps(webhook_data).encode('utf-8')
            req = urllib.request.Request(webhook_url, data=json_data)
            req.add_header('Content-Type', 'application/json')
            req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
            urllib.request.urlopen(req, timeout=5)
        except Exception as e:
            print(f"Error sending to n8n webhook: {e}")

        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            cursor.execute('INSERT INTO applications (name, phone, email, experience, location) VALUES (%s, %s, %s, %s, %s)',
                           (name, phone, email, experience, location))
            conn.commit()
            cursor.close()
            conn.close()
            flash('Ваша заявка успешно отправлена!', 'success')
        else:
            flash('Ошибка подключения к базе данных.', 'danger')
        
    return redirect(url_for('index'))

@app.route('/admin')
def admin():
    if 'other_admin_logged_in' not in session:
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    applications = []
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM applications ORDER BY created_at DESC')
        applications = cursor.fetchall()
        cursor.close()
        conn.close()
    
    return render_template('admin.html', applications=applications)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        # Simple hardcoded check for demonstration, should use database in production 
        # or properly seeded admin user if using the admins table
        if username == 'admin' and password == 'admin':
             session['other_admin_logged_in'] = True
             return redirect(url_for('admin'))
        else:
            flash('Неверный логин или пароль', 'danger')

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('other_admin_logged_in', None)
    return redirect(url_for('login'))

@app.route('/update_status/<int:app_id>/<string:new_status>')
def update_status(app_id, new_status):
    if 'other_admin_logged_in' not in session:
        return redirect(url_for('login'))

    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute('UPDATE applications SET status = %s WHERE id = %s', (new_status, app_id))
        conn.commit()
        cursor.close()
        conn.close()
    
    return redirect(url_for('admin'))

# --- Recruiting Feature ---

def log_candidate_history(candidate_id, event, details=None):
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO candidate_history (candidate_id, event, details, created_at) VALUES (%s, %s, %s, NOW())',
            (candidate_id, event, details)
        )
        conn.commit()
        cursor.close()
        conn.close()

@app.route('/recruiting')
def recruiting_list():
    if 'other_admin_logged_in' not in session:
        return redirect(url_for('login'))
        
    status_filter = request.args.get('status', 'All')
    search_query = request.args.get('q', '')

    conn = get_db_connection()
    candidates = []
    if conn:
        cursor = conn.cursor(dictionary=True)
        
        query = "SELECT * FROM candidates WHERE 1=1"
        params = []
        
        if status_filter != 'All':
            # Handle "InProgress" aggregation
            if status_filter == 'InProgress':
                 query += " AND status IN ('New', 'Contacted', 'Interviewing')"
            else:
                 query += " AND status = %s"
                 params.append(status_filter)
        
        if search_query:
            query += " AND (name LIKE %s OR email LIKE %s)"
            params.extend([f'%{search_query}%', f'%{search_query}%'])
            
        query += " ORDER BY created_at DESC"
        
        cursor.execute(query, params)
        candidates = cursor.fetchall()
        cursor.close()
        conn.close()

    # Calculate stats for the dashboard
    in_progress_count = 0
    hired_count = 0
    rejected_count = 0
    all_count = 0
    
    conn = get_db_connection() # Re-connect for stats
    if conn:
        cursor = conn.cursor()
        cursor.execute("SELECT status, COUNT(*) FROM candidates GROUP BY status")
        stats = cursor.fetchall()
        for stat_status, count in stats:
            all_count += count
            if stat_status in ['New', 'Contacted', 'Interviewing']:
                in_progress_count += count
            elif stat_status == 'Hired':
                hired_count += count
            elif stat_status == 'Rejected':
                rejected_count += count
        cursor.close()
        conn.close()

    return render_template(
        'recruiting.html', 
        candidates=candidates, 
        status_filter=status_filter, 
        search_query=search_query,
        in_progress_count=in_progress_count,
        hired_count=hired_count,
        rejected_count=rejected_count,
        all_count=all_count
    )

@app.route('/recruiting/add', methods=['POST'])
def add_candidate():
    if 'other_admin_logged_in' not in session:
        return redirect(url_for('login'))
        
    name = request.form['name']
    email = request.form.get('email')
    phone = request.form.get('phone')
    source = request.form.get('source', 'Manual')
    role_applied = request.form.get('role_applied', 'Cable Technician (Default)')
    
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO candidates (name, email, phone, source, role_applied, status, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, 'New', NOW(), NOW())",
            (name, email, phone, source, role_applied)
        )
        candidate_id = cursor.lastrowid
        conn.commit()
        cursor.close()
        conn.close()
        
        log_candidate_history(candidate_id, "Candidate Created", f"Source: {source}")
        log_candidate_history(candidate_id, "Status changed to New")
        
        flash('Candidate added successfully!', 'success')
    
    return redirect(url_for('recruiting_list'))

@app.route('/recruiting/<int:candidate_id>')
def candidate_detail(candidate_id):
    if 'other_admin_logged_in' not in session:
        return redirect(url_for('login'))
        
    conn = get_db_connection()
    candidate = None
    history = []
    
    if conn:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM candidates WHERE id = %s", (candidate_id,))
        candidate = cursor.fetchone()
        
        cursor.execute("SELECT * FROM candidate_history WHERE candidate_id = %s ORDER BY created_at DESC", (candidate_id,))
        history = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
    if not candidate:
        flash('Candidate not found.', 'danger')
        return redirect(url_for('recruiting_list'))
        
    return render_template('candidate_detail.html', candidate=candidate, history=history)

@app.route('/recruiting/<int:candidate_id>/update', methods=['POST'])
def update_candidate(candidate_id):
    if 'other_admin_logged_in' not in session:
        return redirect(url_for('login'))
        
    conn = get_db_connection()
    if not conn:
        return redirect(url_for('recruiting_list'))
        
    status = request.form.get('status')
    age = request.form.get('age')
    notes = request.form.get('notes')
    role_applied = request.form.get('role_applied')
    source = request.form.get('source')
    
    # We need to detect what changed to log history
    # Fetch current state first
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM candidates WHERE id = %s", (candidate_id,))
    current = cursor.fetchone()
    
    if not current:
        cursor.close()
        conn.close()
        return redirect(url_for('recruiting_list'))
        
    updates = []
    values = []
    history_messages = []
    
    if status and status != current['status']:
        updates.append("status = %s")
        values.append(status)
        history_messages.append(f"Status changed to {status}")
        
    if age and str(age) != str(current['age']):
        updates.append("age = %s")
        values.append(age)
        history_messages.append(f"Age updated to {age}")

    if role_applied and role_applied != current['role_applied']:
        updates.append("role_applied = %s")
        values.append(role_applied)
        history_messages.append(f"Role updated to {role_applied}")

    if source and source != current['source']:
        updates.append("source = %s")
        values.append(source)
        history_messages.append(f"Source updated to {source}")
        
    if notes is not None:
         if notes != (current['notes'] or ''):
            updates.append("notes = %s")
            values.append(notes)
            history_messages.append("Notes updated")

    if updates:
        values.append(candidate_id)
        sql = f"UPDATE candidates SET {', '.join(updates)}, updated_at = NOW() WHERE id = %s"
        cursor.execute(sql, values)
        conn.commit()
        
        for msg in history_messages:
            log_candidate_history(candidate_id, msg)
            
        flash('Candidate updated', 'success')
        
    cursor.close()
    conn.close()
    
    return redirect(url_for('candidate_detail', candidate_id=candidate_id))

@app.route('/fix_db')
def fix_db():
    try:
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            
            # 1. Fix Schema: Check if role_applied exists
            cursor.execute("SHOW COLUMNS FROM candidates LIKE 'role_applied'")
            if not cursor.fetchone():
                cursor.execute("ALTER TABLE candidates ADD COLUMN role_applied VARCHAR(255)")
                conn.commit()
            
            # 2. Seed Data
            cursor.execute("SELECT COUNT(*) FROM candidates")
            if cursor.fetchone()[0] == 0:
                cursor.execute("""
                    INSERT INTO candidates (name, email, phone, source, role_applied, status, created_at, updated_at)
                    VALUES 
                    ('Oleksandra Sokolova', 'sashasokolova392@gmail.com', '7734617574', 'Manual', 'Cable Technician', 'New', NOW(), NOW()),
                    ('John Doe', 'john.doe@example.com', '555-0123', 'LinkedIn', 'Fiber Splicer', 'Interviewing', NOW(), NOW())
                """)
                conn.commit()
                msg = "Schema fixed & Test data seeded successfully!"
            else:
                msg = "Schema fixed. Data already exists."
                
            cursor.close()
            conn.close()
            return msg
        return "Database connection failed."
    except Exception as e:
        return f"Error: {str(e)}"


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
