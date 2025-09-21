import os
import sys
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler

os.chdir('/home/user/webapp/backend/build')

class MyHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        super().end_headers()
        
    def do_GET(self):
        if self.path == '/' or not '.' in self.path.split('/')[-1]:
            self.path = '/index.html'
        return SimpleHTTPRequestHandler.do_GET(self)

port = 8080
print(f"Starting server on port {port}...")
print(f"Server running at http://localhost:{port}")
sys.stdout.flush()

httpd = HTTPServer(('0.0.0.0', port), MyHandler)
httpd.serve_forever()
