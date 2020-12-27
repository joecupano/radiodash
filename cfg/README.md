## Cfg Files

# Example Radio config in JSON
The code in JS includes the ability to read/parse JSON files from this directory.
Any permanent updates to configurations are deferred to commands sent via websocket for the
backend to process.

# SSL Certificate and Key
The framework uses SSLv3/TLS only. A untrusted self-signed certificate and server key are
provided (radioDASH.crt and radioDASH.key) but it is HIGHLY RECOMMENDED these be replaced with
your own trusted credentials. Know until you have done that you will see (harmless) iostream
errors from STDOUT from the websocket server.