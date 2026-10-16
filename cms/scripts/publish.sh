#!/bin/sh
# Publishes the site: exports the CMS content into a checkout of the site's
# repo and pushes it to main. Cloudflare builds and deploys every push.
#
#   GITHUB_TOKEN   fine-grained token with Contents: read and write
#   SITE_REPO      default pranav2012/Portfolio
#   SITE_CHECKOUT  where to keep the checkout (default /app/data/site)
set -eu

: "${GITHUB_TOKEN:?GITHUB_TOKEN is not set}"
REPO="https://github.com/${SITE_REPO:-pranav2012/Portfolio}.git"
DIR="${SITE_CHECKOUT:-/app/data/site}"
BRANCH=main
EXPORT="$(cd "$(dirname "$0")" && pwd)/export-content.mjs"

# The token goes in a header, so it's never stored in the checkout.
AUTH="Authorization: Basic $(printf 'x-access-token:%s' "$GITHUB_TOKEN" | base64 | tr -d '\n')"
git_() { git -c http.extraHeader="$AUTH" "$@"; }

if [ ! -d "$DIR/.git" ]; then
    git_ clone --quiet --depth 1 --branch "$BRANCH" "$REPO" "$DIR"
fi
cd "$DIR"

for attempt in 1 2 3; do
    git_ fetch --quiet --depth 1 origin "$BRANCH"
    git reset --quiet --hard "origin/$BRANCH"
    node "$EXPORT" "$DIR/web/src/content"
    git add -A web/src/content web/public
    if git diff --cached --quiet; then
        echo "Content unchanged; nothing to publish"
        exit 0
    fi
    git -c user.name="Portfolio CMS" -c user.email="${GIT_EMAIL:-p2012agarwal@gmail.com}" \
        commit --quiet -m "content: update from the CMS"
    if git_ push --quiet origin "HEAD:$BRANCH"; then
        echo "Pushed new content to $BRANCH"
        exit 0
    fi
    echo "Push rejected because $BRANCH moved; trying again (attempt $attempt)"
done
exit 1
