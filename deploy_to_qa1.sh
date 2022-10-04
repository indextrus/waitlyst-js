#!/usr/bin/env bash
set -e
AWS_ACCESS_KEY=$AWS_ACCESS_KEY AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY FILE_PATH=sdk/testing/waitlyst.js node s3.js
