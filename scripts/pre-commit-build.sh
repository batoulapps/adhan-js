#!/bin/bash

npm run build

(git diff --quiet Adhan.js Adhan.js.map)
FILE_STATUS=$?

if [[ $FILE_STATUS -ne 0 ]]; then
    echo "Adhan.js doesn't contain the latest changes. Please run \"npm run build\" and add Adhan.js and Adhan.js.map to your commit."
    exit 1
fi