#!/usr/bin/env bash

export GATEWAY_PORT_STAGING=8001

./fetch-tag-dockerhub.sh

set -o allexport
source .env
set +o allexport

if [ -z "$VERSION" ]; then
  echo "VERSION non défini !"
  exit 1
fi

docker compose -f compose.staging.yml --project-name askandtrust-staging down &&
docker compose -f compose.staging.yml --project-name askandtrust-staging pull &&
docker compose -f compose.staging.yml --project-name askandtrust-staging up -d;