#!/bin/bash

# Fetch Advent of Code input and create input.txt
# Usage: ./scripts/fetch_input.sh <year> <day>

# Check if the required arguments are provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 <year> <day>"
    exit 1
fi

YEAR=$1
DAY_RAW=$2  # Use raw day input (no zero-padding)
DAY=$(printf "%02d" $DAY_RAW) # Zero-pad day for folder name (e.g., day01)

# File containing the session cookie, located next to the script in ./scripts
COOKIE_FILE="$(dirname "$0")/session_cookie"  # Path relative to the script's location

# Check if the cookie file exists
if [ ! -f "$COOKIE_FILE" ]; then
    echo "Error: Session cookie file ($COOKIE_FILE) not found."
    echo "Please create a file named session_cookie.txt next to the script in ./scripts."
    exit 1
fi

# Read the session cookie from the file
SESSION_COOKIE=$(cat "$COOKIE_FILE")

# Validate session cookie
if [ -z "$SESSION_COOKIE" ]; then
    echo "Error: Session cookie is empty. Please check your session_cookie file."
    exit 1
fi

# Construct the URL for the input
URL="https://adventofcode.com/${YEAR}/day/${DAY_RAW}/input"

# Define the target directory (relative path from the root of the project)
TARGET_DIR="./src/${YEAR}/day${DAY}"

# Create the target directory if it doesn't exist
if [ ! -d "$TARGET_DIR" ]; then
    echo "Creating directory: $TARGET_DIR"
    mkdir -p "$TARGET_DIR"
fi

# Fetch the input and save it as input.txt in the target directory
TARGET_FILE="${TARGET_DIR}/input.txt"
echo "Fetching input for Year: $YEAR, Day: $DAY_RAW..."
curl --fail --cookie "session=${SESSION_COOKIE}" "$URL" -o "$TARGET_FILE"

if [ $? -eq 0 ]; then
    echo "Input successfully fetched and saved as $TARGET_FILE."
else
    echo "Failed to fetch input. Please check your session cookie and day/year."
    exit 1
fi