#!/usr/bin/env bash
# Build the app and publish it to S3 + CloudFront.
# Usage: deploy/deploy.sh            (run from app/; needs the AWS CLI and credentials)
# Env:   STACK_NAME (default siris-playbook), AWS_REGION (default us-east-1)
set -euo pipefail

cd "$(dirname "$0")/.."
STACK_NAME="${STACK_NAME:-siris-playbook}"
export AWS_REGION="${AWS_REGION:-us-east-1}"

out() { aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" --output text; }

echo "→ Building"
npm ci
npm test
npm run build

# Sync passphrase: generated once, kept in SSM so every deploy (from any machine) reuses it.
TOKEN_PARAM="/$STACK_NAME/sync-token"
TOKEN="$(aws ssm get-parameter --name "$TOKEN_PARAM" --with-decryption --query Parameter.Value --output text 2>/dev/null || true)"
if [ -z "$TOKEN" ] || [ "$TOKEN" = "None" ]; then
  TOKEN="$(openssl rand -hex 16)"
  aws ssm put-parameter --name "$TOKEN_PARAM" --type SecureString --value "$TOKEN" >/dev/null
  echo "→ Generated a new sync passphrase (stored in SSM at $TOKEN_PARAM)"
fi

echo "→ Creating/updating stack $STACK_NAME in $AWS_REGION (first run takes a few minutes)"
aws cloudformation deploy --stack-name "$STACK_NAME" --template-file deploy/cloudformation.yml \
  --parameter-overrides "SyncToken=$TOKEN" --capabilities CAPABILITY_IAM --no-fail-on-empty-changeset

BUCKET="$(out BucketName)"
DIST="$(out DistributionId)"

echo "→ Uploading to s3://$BUCKET"
# Hashed JS/CSS: cache for a year. Art keeps its filename across builds: cache a day.
# index.html: always revalidate so new builds show up at once.
aws s3 sync dist/ "s3://$BUCKET/" --delete --exclude index.html --exclude "*.webp" --cache-control "public, max-age=31536000, immutable"
aws s3 sync dist/ "s3://$BUCKET/" --exclude "*" --include "*.webp" --cache-control "public, max-age=86400"
aws s3 cp dist/index.html "s3://$BUCKET/index.html" --cache-control "no-cache" --content-type "text/html; charset=utf-8"

echo "→ Invalidating index.html"
aws cloudfront create-invalidation --distribution-id "$DIST" --paths /index.html /  >/dev/null

echo "✓ Live at $(out Url)"
echo "  Sync passphrase (enter once per device via the Sync button): $TOKEN"
