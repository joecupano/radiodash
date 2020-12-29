## Cfg Files

# Example Radio config in JSON (radioDASH.json)
The code in JS includes the ability to read/parse JSON files from this directory.
Any permanent updates to configurations are deferred to commands sent via websocket for the
backend to process.

# SSL Certificate and Key (radioDASH.crt and radioDASH.key)
The framework uses SSLv3/TLS only. A untrusted self-signed certificate and server key are
provided (radioDASH.crt and radioDASH.key) but it is HIGHLY RECOMMENDED these be replaced with
your own trusted credentials. Know until you have done that you will see (harmless) iostream
errors from the websocket server like the following

[SSL: SSLV3_ALERT_CERTIFICATE_UNKNOWN] sslv3 alert certificate unknown (_ssl.c:852)

# User Authentication (radioDASH.pwf)
radioDASH.pwf is a password file that stores ID and password pairs. An account program is included (radioDASH_account.py) to generate your own ID and password pairs into the password file. Passwords are stored as hashes to protect them. The password file is pre-populated with
three ID:Password pairs provided as examples only and should be immediately replaced using the account program.