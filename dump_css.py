
try:
    with open('static/style.css', 'rb') as f:
        content = f.read()
        # The file is likely mostly UTF-8, but has some garbage at the end.
        # Let's decode as much as possible.
        text = content.decode('utf-8', errors='ignore')
        lines = text.splitlines()
        
        # We want to see lines 800 to the end to understand what we have
        # and where the corruption starts.
        with open('css_debug_dump.txt', 'w', encoding='utf-8') as out:
            for i, line in enumerate(lines[800:], 801):
                out.write(f"{i}: {line}\n")
                if i > 2000: break # Safety limit
except Exception as e:
    print(f"Error: {e}")
