#!/usr/bin/env bash

export GATEWAY_PORT_PROD=8000

./fetch-tag-dockerhub.sh

set -o allexport
source .env
set +o allexport

if [ -z "$VERSION" ]; then
  echo "VERSION non défini !"
  exit 1
fi

docker compose -f compose.prod.yml --project-name askandtrust-prod down &&
docker compose -f compose.prod.yml --project-name askandtrust-prod pull &&
docker compose -f compose.prod.yml --project-name askandtrust-prod up -d;