#!/bin/bash

# Check if the server is running
if pm2 status | grep -q 'online'; then
  echo "Application is running."
else
  echo "Application failed to start."
  exit 1  # Exit with a non-zero status to signal failure
fi
