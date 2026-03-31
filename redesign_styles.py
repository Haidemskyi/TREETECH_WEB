
import os

new_css = """
/* =========================================
   ADMIN PANEL REDESIGN (Premium Dark/Teal)
   ========================================= */

/* Admin Layout Structure */
.admin-wrapper {
    display: flex;
    min-height: 100vh;
    font-family: 'Montserrat', sans-serif;
    background-color: #f0f2f5; /* Light Gray Main BG */
}

/* Sidebar Styling */
.sidebar {
    width: 260px;
    background: #111; /* Pure Dark */
    color: #fff;
    display: flex;
    flex-direction: column;
    padding: 0;
    position: fixed;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 100;
    border-right: 1px solid #222;
}

.sidebar-header {
    padding: 30px;
    background: #111;
    border-bottom: 1px solid #222;
}

.sidebar-header h2 {
    color: #fff;
    font-size: 1.8rem;
    font-weight: 900;
    letter-spacing: 1px;
    margin: 0;
    text-transform: uppercase;
}

.sidebar-menu {
    list-style: none;
    padding: 20px 15px;
    margin: 0;
    flex: 1;
}

.sidebar-menu li {
    margin-bottom: 8px;
}

.sidebar-menu a {
    display: flex;
    align-items: center;
    padding: 14px 20px;
    color: #888;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    gap: 15px;
    border: 1px solid transparent;
}

.sidebar-menu a i {
    font-size: 1.1rem;
    width: 24px;
    text-align: center;
    transition: color 0.3s;
}

/* Hover & Active States */
.sidebar-menu a:hover {
    background: #222;
    color: #fff;
}

.sidebar-menu a.active {
    background: #fff;
    color: #111;
    border: 1px solid #fff;
}

.sidebar-menu a.active i {
    color: #111;
}

.sidebar-footer {
    padding: 20px;
    border-top: 1px solid #222;
    background: #111;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-info .avatar {
    width: 40px;
    height: 40px;
    background: #333;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
    border: 1px solid #444;
}

.user-name {
    font-size: 0.9rem;
    font-weight: 700;
    color: #fff;
}

.user-role {
    font-size: 0.75rem;
    color: #888;
}

.logout-btn {
    color: #666;
    font-size: 1.2rem;
    transition: color 0.3s;
}

.logout-btn:hover {
    color: #ff4757;
}

/* Main Content Area */
.main-content {
    flex: 1;
    margin-left: 260px;
    padding: 40px;
    background: #f0f2f5;
    width: calc(100% - 260px);
}

/* Recruiting Header & Cards */
.recruiting-header h2 {
    font-size: 2rem;
    color: #111;
    letter-spacing: -0.5px;
}

.btn-primary-action {
    background: var(--primary);
    color: #000;
    padding: 12px 25px;
    border-radius: 30px;
    font-weight: 800;
    text-transform: uppercase;
    border: none;
    box-shadow: 0 4px 15px rgba(28, 237, 200, 0.3);
    cursor: pointer;
    transition: all 0.2s; 
    text-decoration: none;
    display: inline-block;
}

.btn-primary-action:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(28, 237, 200, 0.4);
    background: #fff;
}

/* Stats Cards Redesign */
.stats-row {
    display: flex;
    gap: 25px;
    margin-bottom: 40px;
}

.stat-card {
    background: white;
    border: 1px solid #eee; /* Light Gray Border */
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    border-color: #ddd;
}

/* Remove colored top borders */
.stat-card::after { display: none; }

.stat-header {
    font-size: 0.8rem;
    color: #888;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 1px;
    margin-bottom: 15px;
}

.stat-value {
    font-size: 2.8rem;
    color: #111;
    font-weight: 900;
    line-height: 1;
}

/* Table Card Redesign */
.candidates-section {
    background: white;
    border-radius: 16px;
    border: 1px solid #eee;
    box-shadow: 0 10px 40px rgba(0,0,0,0.04);
    overflow: hidden;
}

.section-header {
    background: #fff;
    padding: 25px 30px;
    border-bottom: 1px solid #f1f1f1;
}

.section-header h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #111;
}

.candidates-table th {
    background: #fafafa;
    color: #111;
    font-size: 0.75rem;
    letter-spacing: 1px;
    border-bottom: 1px solid #eee;
    padding: 20px 30px;
    text-transform: uppercase;
    font-weight: 800;
}

.candidates-table td {
    padding: 20px 30px;
    border-bottom: 1px solid #f9f9f9;
    color: #333;
    font-weight: 500;
    font-size: 0.95rem;
}

.candidates-table tr:last-child td {
    border-bottom: none;
}

.candidates-table tr {
    transition: background 0.2s;
    cursor: pointer;
}

.candidates-table tr:hover {
    background: #fafafa;
}

/* Search Input */
.search-form input {
    background: #fff;
    border: 1px solid #ddd;
    padding: 12px 20px;
    border-radius: 8px; /* Less rounded */
    width: 300px;
    transition: all 0.3s;
}

.search-form input:focus {
    background: white;
    border-color: #111;
    outline: none;
}

/* Badges Redesign - Monochrome / Minimal */
.badge {
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    border: 1px solid #eee;
}

.badge-new { background: #fff; color: #111; border-color: #ccc; }
.badge-contacted { background: #f9f9f9; color: #555; }
.badge-interviewing { background: #111; color: #fff; border-color: #111; }
.badge-hired { background: #fff; color: #111; border: 1px solid #111; }
.badge-rejected { background: #fff; color: #999; text-decoration: line-through; }


/* Detail View Redesign */
.details-layout {
    display: grid;
    grid-template-columns: 2fr 1fr; /* Left 2/3, Right 1/3 */
    gap: 30px;
    align-items: start;
}

.left-column {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.right-column {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.detail-card {
    height: auto;
}

.history-card {
    min-height: 100%;
}

.profile-header-card {
    background: white;
    padding: 35px 40px; /* More breathing room */
    border-radius: 16px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02); /* Very subtle shadow */
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #f0f0f0;
}

.avatar-large {
    width: 70px;
    height: 70px;
    background: #f8f8f8;
    color: #111;
    font-size: 1.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-weight: 600;
    margin-right: 25px;
    border: 1px solid #eee;
}

.profile-main {
    display: flex;
    align-items: center;
}

.profile-info h1 {
    font-size: 1.6rem;
    margin-bottom: 8px;
    font-weight: 800;
    color: #111;
    text-transform: uppercase;
    letter-spacing: -0.5px;
}

.contact-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    color: #666;
    margin-right: 20px;
    font-weight: 500;
}

.contact-pill i { color: #999; }

.btn-dark-action {
    background: #000;
    color: white;
    padding: 12px 30px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.85rem;
    transition: all 0.2s;
    letter-spacing: 0.5px;
}

.btn-dark-action:hover {
    background: #333;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn-link-action {
    background: #fafafa;
    color: #666;
    border: 1px dashed #ddd;
    padding: 25px;
    width: 100%;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s;
    font-weight: 500;
}

.btn-link-action:hover {
    border-color: #999;
    color: #111;
    background: #fff;
}

.detail-card-title {
    font-size: 0.95rem;
    font-weight: 800;
    margin-bottom: 25px;
    color: #111;
    display: flex;
    align-items: center;
    gap: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.detail-card-title i { color: #ccc; } /* Subtle icon */

.detail-card-title i { color: #111; }

.form-label {
    font-size: 0.7rem;
    color: #666;
    font-weight: 700;
    margin-bottom: 8px;
    display: block;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.form-control {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    background: #fff;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #111;
    transition: all 0.3s;
}

.form-control:read-only {
    background: #fafafa;
    color: #555;
    border-color: #eee;
}

.form-control:focus {
    border-color: #111;
    background: #fff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.05);
}

.timeline {
    padding-left: 20px;
    border-left: 1px solid #eee;
    margin-top: 10px;
}

.timeline-dot {
    background: #111; /* Black Dot */
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: absolute;
    left: -25.5px; /* Precision alignment */
    top: 6px;
    border: 2px solid white;
    box-shadow: 0 0 0 1px #e0e0e0;
}

.timeline-content {
    padding-bottom: 35px;
}

.timeline-time {
    font-size: 0.75rem;
    color: #aaa;
    margin-top: 4px;
    font-weight: 600;
}

/* Modal Redesign */
.modal-container {
    background: white;
    border-radius: 20px;
    box-shadow: 0 25px 80px rgba(0,0,0,0.25);
    padding: 40px;
    border: 1px solid rgba(0,0,0,0.05);
}

.modal-header h2 {
    font-size: 1.8rem;
    color: #111;
    margin-bottom: 10px;
}

/* Icons Overrides for FontAwesome fallback */
.icon-grid::before { content: "\\28ec"; }
.icon-users::before { content: "\\1F465"; }
.icon-log-out::before { content: "\\1F6AA"; }
.icon-phone::before { content: "\\1F4DE"; }
.icon-mail::before { content: "\\2709"; }

"""

try:
    with open('static/style.css', 'rb') as f:
        content = f.read()
        text = content.decode('utf-8', errors='ignore')
        lines = text.splitlines()

    # Find the cut point: "/* Admin Layout Overrides */" or similar
    cut_index = -1
    for i, line in enumerate(lines):
        if "/* Admin Layout Overrides */" in line:
            cut_index = i
            break
        if "/* =========================================" in line:
            cut_index = i
            break
            
    if cut_index != -1:
        clean_lines = lines[:cut_index]
        print(f"Cutting file at line {cut_index} (removing old admin styles).")
        
        with open('static/style.css', 'w', encoding='utf-8') as f:
            f.write('\n'.join(clean_lines))
            f.write('\n')
            f.write(new_css)
        print("Successfully redesigned Admin styles.")
    else:
        # If not found, try to append? Or look for previous cut?
        # The previous label was /* Admin Layout Overrides */
        print("Could not find '/* Admin Layout Overrides */'. Appending to end.")
        with open('static/style.css', 'a', encoding='utf-8') as f:
            f.write('\n')
            f.write(new_css)

except Exception as e:
    print(f"Error: {e}")
