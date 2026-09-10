#!/bin/bash
set -euo pipefail

OUTPUT_NAME="$1"
KEY="$2"

pulumi stack output "$OUTPUT_NAME" --show-secrets --json | jq -er --arg e "$KEY" '.[$e]'
