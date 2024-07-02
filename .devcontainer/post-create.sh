#!/usr/bin/env bash

set -euxo pipefail

sudo chown -R node .

sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get clean
sudo rm -rf /var/lib/apt/lists/*

sudo corepack enable npm
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
npm install
