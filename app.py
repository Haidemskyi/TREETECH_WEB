import json
import urllib.request
from flask import Flask, render_template, request, redirect, url_for, flash, session
import os

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Change this in production

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
            
            with urllib.request.urlopen(req, timeout=5) as response:
                status = response.getcode()
                resp_body = response.read().decode('utf-8')
                print(f"n8n webhook response: {status} - {resp_body}")
                
            flash('Ваша заявка успешно отправлена!', 'success')
        except urllib.error.HTTPError as e:
            print(f"n8n webhook HTTP Error: {e.code} - {e.reason}")
            flash('Ошибка при уведомлении (HTTP).', 'warning')
        except Exception as e:
            print(f"Error sending to n8n webhook: {e}")
            flash('Ошибка при отправке уведомления.', 'danger')
        
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
