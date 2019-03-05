#!/usr/bin/env bash

npm install -g n
n 8.9.3

pushd native
    npm run deps
popd
