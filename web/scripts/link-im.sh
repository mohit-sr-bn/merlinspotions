#!/usr/bin/env bash
set -e

# MOBIFY_INTEGRATION_MANAGER is the relative path from `platform-scaffold/web/` to `mobify-integration-manager`
MOBIFY_INTEGRATION_MANAGER=$1
PLATFORM_SCAFFOLD_WEB=$(pwd)

if [ $# -eq 0 ] ; then
    echo "No parameters! Please pass the relative path to the directory of the package."; exit 1;
elif [ ! -d $MOBIFY_INTEGRATION_MANAGER ]; then
    echo "Cannot find the directory that you want to link: $1"; exit 1;
elif [ ! -d "./node_modules/mobify-integration-manager" ]; then
    echo "Installing dependencies for Platform Scaffold"
    npm i
fi

if [ -d "$MOBIFY_INTEGRATION_MANAGER/node_modules" ] ; then
    # Remove IM's node_modules folder because npm will complain during npm link
    # Fix npm error: "Refusing to delete, files out of control"
    echo "Uninstalling dependencies for mobify-integration-manager"
    rm -rf "$MOBIFY_INTEGRATION_MANAGER/node_modules"
fi

echo "npm link mobify-integration-manager"
npm link $MOBIFY_INTEGRATION_MANAGER
cd "$MOBIFY_INTEGRATION_MANAGER/node_modules/progressive-web-sdk"
echo "Installing devDependencies for mobify-integration-manager/node_modules/progressive-web-sdk"
npm i
