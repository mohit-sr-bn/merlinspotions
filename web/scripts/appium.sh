#!/usr/bin/env bash
set -e

# Find the global install path of appium's WebDriverAgent
# Then build WebDriverAgent for iOS Simulator
# and start Appium server

# If necessary, change the default port that WebDriverAgent starts on
# (should be 8100)
# https://github.com/facebook/WebDriverAgent/issues/661#issuecomment-338900334

trap 'kill $(jobs -p)' EXIT > /dev/null 2>&1

. ~/.nvm/nvm.sh
GLOBAL_NODE_MODULES_PATH=$(nvm which current)

WDA_PATH="${GLOBAL_NODE_MODULES_PATH%/bin/node}""/lib/node_modules/appium/node_modules/appium-xcuitest-driver/WebDriverAgent"

cd $WDA_PATH

xcodebuild -project WebDriverAgent.xcodeproj -scheme WebDriverAgentRunner -destination 'platform=iOS Simulator,OS=11.2,name=iPhone 6s' test &

echo "Wait for WebDriverAgent to start"
while ! echo exit | nc localhost 8100; do sleep 5; done

appium --log-level info &

echo "Wait for Appium to start"
while ! echo exit | nc localhost 4732; do sleep 5; done

echo "Ready for testing"
