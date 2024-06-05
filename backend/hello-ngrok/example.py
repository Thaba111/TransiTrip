#!/usr/bin/env python

from http.server import HTTPServer, BaseHTTPRequestHandler
import logging, ngrok


class HelloHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        body = bytes("Hello", "utf-8")
        self.protocol_version = "HTTP/1.1"
        self.send_response(200)
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)


logging.basicConfig(level=logging.INFO)
server = HTTPServer(("localhost", 0), HelloHandler)
ngrok_tunnel = ngrok.connect(5000)
logging.info("ngrok tunnel \"{}\" -> \"http://127.0.0.1:{}/\"".format(ngrok_tunnel.public_url, server.server_port))
server.serve_forever()
# import base64
# from datetime import datetime

# def generate_timestamp():
#     timestamp_format = "%Y%m%d%H%M%S"
#     timestamp = datetime.now().strftime(timestamp_format)
#     print(f"Generated Timestamp: {timestamp}")
#     return timestamp

# def generate_password(business_short_code, pass_key, timestamp):
#     password = f"{business_short_code}{pass_key}{timestamp}"
#     encoded_password = base64.b64encode(password.encode()).decode()
#     print(f"Generated Password: {encoded_password}")
#     return encoded_password

# # Example usage
# business_short_code = '174379'
# pass_key = 'your_lipa_na_mpesa_online_passkey'
# timestamp = generate_timestamp()
# password = generate_password(business_short_code, pass_key, timestamp)
