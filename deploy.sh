#!/bin/bash
set -e
SERVICE_ACCOUNT=$(gcloud iam service-accounts list | grep 'App Engine default' | awk '{print $6}')
echo "Using service account: $SERVICE_ACCOUNT"
echo "Generating key..."
gcloud iam service-accounts keys create secret_key.json --iam-account=$SERVICE_ACCOUNT
KEY_ID=$(cat secret_key.json | grep key_id | awk -F'"' '{print $4}')
echo "Key $KEY_ID generated."
echo "Deploying..."

set +e
./node_modules/serverless/bin/serverless deploy
echo "Removing key..."
set -e
gcloud iam service-accounts keys delete $KEY_ID --iam-account=$SERVICE_ACCOUNT -q
rm -f secret_key.json

echo "Deployment finished."
