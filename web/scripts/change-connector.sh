#!/usr/bin/env bash

BACKUP_EXT=bak

if [ "$1" == "" ]; then
    echo "Usage: ${basename $0} [merlins sfcc hybris stub]"
    exit
fi

function cleanup() {
    rm -rf "app/main.jsx.$BACKUP_EXT"
}

trap cleanup EXIT

TARGET_CONNECTOR="$1"
echo "Changing connector to: $TARGET_CONNECTOR..."

# Change connector to the second argument
# eg: ./change-connector.sh sfcc

# Comment out all initConnectors
sed -i.$BACKUP_EXT -E 's|^[[:space:]]*(import initConnector.*)|// \1|' app/main.jsx

# Uncomment the target connector we want
sed -i.$BACKUP_EXT -E "s|^[[:space:]]*//[[:space:]]*(import .*init-${TARGET_CONNECTOR}-connector.*)|\1|" app/main.jsx
