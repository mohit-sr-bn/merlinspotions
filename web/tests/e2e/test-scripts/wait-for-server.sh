#!/usr/bin/env bash
# This scripts is for CI purposes, waiting until the devleopment server is up before initiating the next step

port=${1:-8443}
echo "Waiting for local dev server to be ready"
counter=0
while ! nc -z localhost $port; do 
if [[ "$counter" -gt 120 ]]; then
        cat logs/startTestServer.log
        echo 'Unable to start ssr'
        exit 1
    else
        counter=$((counter+1))
        sleep 2
    fi 
done
printf "local development server is ready"
