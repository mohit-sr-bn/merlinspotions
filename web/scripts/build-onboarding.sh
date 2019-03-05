#!/usr/bin/env bash
set -e

webpack --config webpack/base.onboarding.js --display-error-details --bail

# Copy native onboarding
rimraf ../native/app/build/app-www/onboarding/*
mkdir -p ../native/app/build/app-www/onboarding
cp -r build/index.html ../native/app/build/app-www/onboarding
cp -r build/onboarding.js ../native/app/build/app-www/onboarding
cp -r build/onboarding.js.map ../native/app/build/app-www/onboarding
mkdir -p ../native/app/build/app-www/onboarding/static/img/onboarding
cp -r build/static/img/onboarding/* ../native/app/build/app-www/onboarding/static/img/onboarding