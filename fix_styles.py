
import os

new_css = """
/* --- Recruiting Module Styles --- */

.bg-gray {
    background-color: #f4f7f6;
}

.recruiting-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.text-muted {
    color: #888;
    font-size: 0.9rem;
}

/* Stat Cards */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stat-card {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s, box-shadow 0.2s;
    border: 2px solid transparent;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.stat-card.active {
    border-color: var(--primary);
}

.stat-title {
    font-size: 0.85rem;
    color: #666;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.stat-value {
    font-size: 2.5rem;
    font-weight: 800;
    margin-top: 10px;
    color: #333;
}

/* Card Colors */
.card-blue .stat-value { color: #3498db; }
.card-blue.active { border-color: #3498db; }

.card-green .stat-value { color: #2ecc71; }
.card-green.active { border-color: #2ecc71; }

.card-red .stat-value { color: #e74c3c; }
.card-red.active { border-color: #e74c3c; }


/* Content Card & Table */
.content-card,
.card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    margin-bottom: 30px;
}

.card-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.search-form input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    width: 250px;
}

.recruiting-table {
    width: 100%;
    border-collapse: collapse;
}

.recruiting-table th,
.recruiting-table td {
    padding: 15px 20px;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
}

.recruiting-table th {
    background: #fafafa;
    color: #666;
    font-weight: 600;
    font-size: 0.9rem;
}

.recruiting-table tr:hover {
    background-color: #f9f9f9;
}

/* Badges */
.badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
}

.badge-new { background: #E0E7FF; color: #4338CA; }
.badge-contacted { background: #FEF3C7; color: #D97706; }
.badge-interviewing { background: #DBEAFE; color: #1D4ED8; }
.badge-hired { background: #D1FAE5; color: #059669; }
.badge-rejected { background: #FEE2E2; color: #DC2626; }

/* Modal (Extension of existing modal styles) */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.modal-container {
    background: white;
    padding: 30px;
    border-radius: 12px;
    width: 100%;
    max-width: 500px;
    position: relative;
    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
}

.close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 1.5rem;
    cursor: pointer;
    line-height: 1;
}

/* Updated Candidate Detail Styles */
.grid-2-1 {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
}

.profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.profile-main {
    display: flex;
    align-items: center;
    gap: 20px;
}

.avatar-large {
    width: 80px;
    height: 80px;
    background: var(--primary);
    color: var(--dark);
    font-size: 2.5rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.profile-info h1 {
    font-size: 1.8rem;
    margin-bottom: 5px;
    color: var(--dark);
}

.contact-row span {
    margin-right: 20px;
    color: #666;
    font-size: 0.95rem;
}

.status-selector label {
    display: block;
    font-size: 0.8rem;
    margin-bottom: 5px;
    color: #888;
    text-align: right;
}

.status-dropdown {
    padding: 10px 15px;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    min-width: 150px;
}

/* Form Styles */
.form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.form-group {
    flex: 1;
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #444;
    font-size: 0.9rem;
}

.form-control {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    box-sizing: border-box;
    transition: border-color 0.2s;
}

.form-control:focus {
    outline: none;
    border-color: var(--primary);
}

.form-control[readonly] {
    background-color: #f9f9f9;
    color: #666;
}

/* Timeline */
.timeline {
    position: relative;
    padding-left: 20px;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 0;
    top: 5px;
    bottom: 0;
    width: 2px;
    background: #eee;
}

.timeline-item {
    position: relative;
    margin-bottom: 30px;
}

.timeline-dot {
    position: absolute;
    left: -25px;
    top: 5px;
    width: 12px;
    height: 12px;
    background: var(--dark);
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 0 0 2px #eee;
}

.timeline-content strong {
    display: block;
    color: #333;
    font-size: 0.95rem;
    margin-bottom: 3px;
}

.timeline-date {
    font-size: 0.8rem;
    color: #999;
}

/* Documents */
.upload-area {
    border: 2px dashed #ddd;
    border-radius: 12px;
    padding: 40px 20px;
    text-align: center;
    color: #888;
    background: #fafafa;
    transition: background 0.2s;
}

.upload-area:hover {
    background: #f0f0f0;
}

/* Sidebar Overrides for Admin Wrapper */
.sidebar-menu i {
    font-size: 1.1rem;
    width: 24px;
    text-align: center;
}

.sidebar-menu a:hover i,
.sidebar-menu a.active i {
    color: inherit;
}
"""

try:
    with open('static/style.css', 'rb') as f:
        content = f.read()
        # Decode ignoring errors to get the valid part
        text = content.decode('utf-8', errors='ignore')
        lines = text.splitlines()

    # The first 1251 lines observed in the dump were correct.
    # Lines are 0-indexed in list, so we take up to index 1251 (exclusive) ?
    # Wait, the dump line numbers were 1-based.
    # "1251: }" was the last good line.
    # So we want lines[0:1252] (since python slice end is exclusive)
    
    clean_lines = lines[:1252]
    
    with open('static/style.css', 'w', encoding='utf-8') as f:
        f.write('\n'.join(clean_lines))
        f.write('\n')
        f.write(new_css)
        
    print("Successfully repaired style.css")
    
except Exception as e:
    print(f"Error repairing file: {e}")
