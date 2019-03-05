#!/bin/bash -eu
set -o pipefail
set -o nounset

# Run automated end-to-end (e2e) tests to verify that checkout still works.
# npm run smoke-test

echo "Running tests against local build"
# Kill background processes when this script exits.
trap 'kill $(jobs -p)' EXIT > /dev/null 2>&1
npm run prod:build
npm run test:server > /dev/null 2>&1 &

# Run the tests to verify that checkout flow still works.
# If on CIRCLE, it will find all test files under /workflows to distribute evenly among machines for parallelism
# If there is not, then it will run locally
VALUE=${CIRCLECI:-}

if [[  -z "${VALUE}" ]]; then
    npm run test:e2e
else
  testfiles=$(find ./tests/e2e/workflows/ -name '*.js'| sort | awk "NR % ${CIRCLE_NODE_TOTAL} == ${CIRCLE_NODE_INDEX}")
  if [ -z "$testfiles" ]
  then
      echo "more parallelism than tests"
  else
      npm run test:e2e --tests $testfiles
  fi
fi

