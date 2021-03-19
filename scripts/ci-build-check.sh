#!/bin/bash
set +e

(git diff --quiet Adhan.js Adhan.js.map)
DIFF_STATUS=$?

if [[ $DIFF_STATUS -ne 0 ]]; then
    echo "::error file=Adhan.js::Adhan.js doesn't contain the latest changes. Please run \"npm run build\" and add Adhan.js and Adhan.js.map to your commit."
    exit 1
fi