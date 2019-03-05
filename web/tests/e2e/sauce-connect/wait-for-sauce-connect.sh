#!/usr/bin/env bash
echo "Waiting for Sauce Connect tunnel to be ready"
counter=0
while ! nc -z localhost 4445; do 
if [[ "$counter" -gt 30 ]]; then
        cat logs/startTestServer.log
        echo 'Unable to start Sauce Connect.'
        exit 1
    else
        counter=$((counter+1))
        sleep 2
    fi 
done
printf "Sauce Connect is ready\n"
