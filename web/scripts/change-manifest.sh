#!/usr/bin/env bash

BACKUP_EXT=bak

if [ "$1" == "" ]; then
    echo "Usage: ${basename $0} [www sfcc hybris staging]"
    exit
fi

function cleanup() {
    rm -rf "app/static/manifest.json.$BACKUP_EXT"
}

trap cleanup EXIT

TARGET_LOCATION="$1"
echo "Changing connector to: $TARGET_LOCATION..."

# Change the manifest sub-domain to the second argument
# eg: ./change-manifest.sh sfcc

# Uncomment the target connector we want
sed -i.$BACKUP_EXT -E "s/start_url\":[[:space:]]\"https:\/\/www/start_url\": \"https:\/\/${TARGET_LOCATION}/" app/static/manifest.json
