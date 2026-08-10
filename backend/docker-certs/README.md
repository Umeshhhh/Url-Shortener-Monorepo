# Local Docker trust certificates

Place organization-managed root CA certificates (`*.crt`) in this directory
when the development network performs TLS inspection. Docker copies them into
the backend image and Node uses the resulting Linux CA bundle when Prisma
downloads its engines.

Certificate files are intentionally ignored by Git. Copy/export only public
root certificates from the host trust store; never place private keys here.
TLS verification must remain enabled.
