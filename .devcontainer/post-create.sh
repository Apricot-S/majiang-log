#!/usr/bin/env bash

set -euxo pipefail

# Set up colorful debug output for the script
PS4='+${BASH_SOURCE[0]}:$LINENO: '
if [[ -t 1 ]] && type -t tput >/dev/null; then
  if (( "$(tput colors)" == 256 )); then
    PS4='$(tput setaf 10)'$PS4'$(tput sgr0)'
  else
    PS4='$(tput setaf 2)'$PS4'$(tput sgr0)'
  fi
fi

sudo chown -R node .

sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get clean
sudo rm -rf /var/lib/apt/lists/*

sudo corepack enable npm
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
npm install
