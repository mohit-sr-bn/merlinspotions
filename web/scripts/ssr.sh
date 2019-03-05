#!/usr/bin/env bash

# Make sure we're in the web directory
cd "$(dirname $0)/.."

if ! node ./scripts/check-ssr.js ; then
    echo "Please set mobify.ssrEnabled to true in package.json to enable SSR"
    exit 1
fi

# Set signals to kill the whole process tree including any background
# webpack.
trap "exit" INT TERM
trap "kill 0" EXIT

echo -e "\nComputing routes and hash manifest"
sdk-get-routes
sdk-create-hash-manifest

# Remove the marker file that tells us the build is done
echo "Configuring for build"
mkdir -p build
BUILD_MARKER=build/build.marker
rm -f ${BUILD_MARKER}

echo -e "\nStarting background Webpack process and waiting for first build..."
env TOUCH_BUILD_MARKER=1 DEVTOOL="source-map"  webpack --mode development --watch ${WEBPACK_OPTIONS} --config webpack/dev.js &

# Wait for the build marker to appear
COUNT=0
while [ "$COUNT" -lt 120 -a ! -e ${BUILD_MARKER} ]; do
        COUNT=$((COUNT+1))
        sleep 1
done
if ! [ -e ${BUILD_MARKER} ]; then
    echo "Build did not complete"
    exit 1
fi

# Add the localhost cert
export NODE_EXTRA_CA_CERTS='./dev-server/localhost.pem'

echo -e "\nLaunching SSR server"
if [ "$1" == "inspect" ]
then
    nodemon -- --inspect=localhost:9229 --expose-gc build/ssr.js
else
    nodemon -- --expose-gc build/ssr.js
fi
