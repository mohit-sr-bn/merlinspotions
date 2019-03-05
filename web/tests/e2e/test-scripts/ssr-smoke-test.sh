#!/bin/bash -eu
set -o pipefail
set -o nounset

# Run an automated test to verify that an SSR build works.
# Assumes that the SSR server is running as another process

echo "Waiting for SSR server to start..."
COUNT=0
PORT=3443
while ! nc -z localhost ${PORT} ; do
    sleep 1
    COUNT=$((COUNT+1))
    if [ "$COUNT" -ge 120 ] ; then
        echo "SSR server did not start - did you remember to start it?"
        exit 1
    fi
done

# Run the test
echo "Running SSR tests"
env SKIP_PREVIEW=1 npm run test:e2e --tests ./tests/e2e/ssr/ssr.js
