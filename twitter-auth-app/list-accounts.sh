#!/bin/bash

# This script displays all registered accounts saved in the local database

DATA_FILE="backend/data/users.json"

if [ ! -f "$DATA_FILE" ]; then
  echo "❌ No saved accounts found. Create some accounts first by signing up!"
  exit 0
fi

echo "📊 REGISTERED ACCOUNTS"
echo "====================="
echo ""

# Use jq if available, otherwise use simple grep
if command -v jq &> /dev/null; then
  jq -r '.[] | "\(.email) | Username: \(.username) | Name: \(.firstName) \(.lastName) | Created: \(.createdAt)"' "$DATA_FILE"
else
  # Fallback for systems without jq
  echo "Accounts in backend/data/users.json:"
  cat "$DATA_FILE" | grep -o '"email":"[^"]*"' | sed 's/"email":"//;s/"//'
fi

echo ""
echo "✅ Available for login with their original passwords"
echo ""

# Show count
if command -v jq &> /dev/null; then
  COUNT=$(jq length "$DATA_FILE")
  echo "Total accounts: $COUNT"
fi
