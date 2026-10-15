#!/usr/bin/env bash
# Usage (on the server, inside /frontend):  bash deploy.sh <pm2-app-name>
set -euo pipefail
APP="${1:?Pass the pm2 app name, e.g. bash deploy.sh etieducom-frontend}"

cd "$(dirname "$0")"
git pull
yarn install --frozen-lockfile || yarn install

# Build into a temp folder so the live site keeps working until the new build is ready
rm -rf .next-new
NEXT_DIST_DIR=.next-new yarn build

# Swap builds and restart immediately so HTML and static files always match
rm -rf .next-old
[ -d .next ] && mv .next .next-old
mv .next-new .next
pm2 restart "$APP" --update-env
rm -rf .next-old
echo "Deployed. Check: curl -sI https://www.etieducom.com/ and View Source for GTM-NW9SKWNV"
