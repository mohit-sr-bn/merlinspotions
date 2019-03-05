#!/usr/bin/env bash
# npm run test:pwa-prod

# Get Timestamp
timestamp=`date +'%m-%d_%T'`

OUTPUT_PATH=tests/performance/lighthouse/reports/audit-prod-${2-default}-${timestamp}
# See package.json's siteUrl key.
URL=${1-$npm_package_siteUrl}

lighthouse \
	--chrome-flags="--window-size=412,800" \
	--config-path tests/performance/lighthouse/prod-lighthouse-config.js \
	--quiet \
	--output json \
	--output html \
	--output-path $OUTPUT_PATH \
	$URL

npm run test:check-lighthouse-score $OUTPUT_PATH.report.json
echo "Report located in:" $OUTPUT_PATH.report.html