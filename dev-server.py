#!/usr/bin/env python3
"""Local dev server: serves static files AND accepts POST /save from the
in-browser edit mode so you can persist HTML edits straight to disk.

Usage:  python3 dev-server.py [port]   (default 8765, bind 127.0.0.1)
"""
import json
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
WRITABLE = {"pitch-deck.html", "overview.html"}


class Handler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/save":
            self.send_error(404)
            return

        length = int(self.headers.get("Content-Length", 0))
        try:
            payload = json.loads(self.rfile.read(length))
        except json.JSONDecodeError:
            self.send_error(400, "invalid json")
            return

        name = payload.get("path", "")
        html = payload.get("html", "")

        # Only allow bare filenames in the writable whitelist.
        if not isinstance(name, str) or "/" in name or name not in WRITABLE:
            self.send_error(403, "path not allowed")
            return
        if not isinstance(html, str) or not html.startswith("<!DOCTYPE"):
            self.send_error(400, "html must start with <!DOCTYPE")
            return

        target = os.path.join(ROOT, name)
        with open(target, "w", encoding="utf-8") as f:
            f.write(html)

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps({"ok": True, "bytes": len(html)}).encode())

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("[dev] %s\n" % (fmt % args))


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    os.chdir(ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"serving {ROOT} at http://127.0.0.1:{port}  (POST /save writes to disk)")
    server.serve_forever()
