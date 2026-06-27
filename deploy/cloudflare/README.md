# Cloudflare origin certificate files

Place the following files in this directory on the production server:

- `origin.pem` - the Cloudflare Origin CA certificate (PEM format)
- `origin.key` - its private key (PEM format)

Create them in Cloudflare under **SSL/TLS > Origin Server > Create certificate**.
Include both `snip.umesh.app` and `*.umesh.app` when Cloudflare asks for hostnames.

Never commit either file. The repository `.gitignore` excludes `*.pem` and `*.key`.
Restrict access to the private key on the server (for example, `chmod 600
deploy/cloudflare/origin.key` on Linux).

