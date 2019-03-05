#!/usr/bin/env bash
# Build the project: npm run prod:build
# Then run this script: npm run test:server

# Remove any leftover compressed files...
find build -name '*.gz' -exec rm -f {} \;

# ...compress files so that we can serve with gzip
find build -type f -exec gzip -9 --keep --force {} \;

# Start test server on build folder
http-server --ssl --cors --p=8443 \
    --gzip \
	--key dev-server/localhost.pem \
	--cert dev-server/localhost.pem \
	build
