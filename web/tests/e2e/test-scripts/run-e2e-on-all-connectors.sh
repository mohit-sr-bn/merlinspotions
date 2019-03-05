#!/usr/bin/env bash
echo 'Running Tests on Merlins Connector'
npm run test:e2e

./scripts/change-connector.sh sfcc
echo 'Running Tests on SFCC Connector'
sleep 1
npm run test:e2e -- --tag sfcc --group workflows/sfcc

./scripts/change-connector.sh stub
echo 'Running Tests on stub Connector'
sleep 1
npm run test:e2e -- --tag stub --group workflows/stub

# Reset to Merlins connector
./scripts/change-connector.sh merlins