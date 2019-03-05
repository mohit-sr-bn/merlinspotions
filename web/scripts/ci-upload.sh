#!/bin/bash

#
# Auto bundle uploads for CircleCI
# --------------------------------
#
# This script is called from .circleci/config.yml.
#
# You need to configure the following environment variables via
# CircleCI's web form:
#
# MOBIFY_CLIENT_USER:
#   The Mobify Client email address so we can deploy the bundle to Cloud.
#
# MOBIFY_CLIENT_API_KEY:
#   The Mobify Client API key so we can deploy the bundle to Cloud.
#

set -e

MOBIFY_CLIENT_USER=${MOBIFY_CLIENT_USER:?"Need to set MOBIFY_CLIENT_USER"}
MOBIFY_CLIENT_API_KEY=${MOBIFY_CLIENT_API_KEY:?"Need to set MOBIFY_CLIENT_API_KEY"}
CIRCLE_BUILD_NUM=${CIRCLE_BUILD_NUM:?"Need to set CIRCLE_BUILD_NUM"}
CIRCLE_BRANCH=${CIRCLE_BRANCH:?"Need to set CIRCLE_BRANCH"}
CIRCLE_SHA1=${CIRCLE_SHA1:?"Need to set CIRCLE_SHA1"}
# CONNECTOR variable can be removed when the project is generated.
CONNECTOR=$1

# Upload the bundle to Cloud project
npm run save-credentials -- \
    --user "${MOBIFY_CLIENT_USER}" \
    --key "${MOBIFY_CLIENT_API_KEY}"

MESSAGE="build #${CIRCLE_BUILD_NUM} on ${CIRCLE_BRANCH} (${CIRCLE_SHA1})"

# Remove after the project is generated.
if [ -n "$CONNECTOR" ]; then
	MESSAGE="$MESSAGE, $CONNECTOR"
fi

# Remove after the project is generated.
if [ "$CIRCLE_BRANCH" == "develop" ]; then
    MESSAGE="CI $MESSAGE"
else
    MESSAGE="Release $MESSAGE"
fi

npm run push -- \
    --message "$MESSAGE" \
    # Optionally specify a TARGET to which the bundle is published
    # --target "$TARGET"
