#!/usr/bin/env bash
set -e

rimraf build/
sdk-get-routes
sdk-create-hash-manifest
webpack --config webpack/production.js --display-error-details --bail

