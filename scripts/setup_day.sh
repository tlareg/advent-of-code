#!/bin/bash

# Setup Advent of Code day directory with input, index.ts, and test_input.txt
# Usage: ./scripts/setup_day.sh <year> <day>

# Check if the required arguments are provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 <year> <day>"
    exit 1
fi

YEAR=$1
DAY_RAW=$2  # Use raw day input (no zero-padding)
DAY=$(printf "%02d" $DAY_RAW) # Zero-pad day for folder name (e.g., day01)

# Call the already created script to fetch the Advent of Code input
./scripts/fetch_input.sh "$YEAR" "$DAY_RAW"

# Define the target directory (with zero-padding for folder name)
TARGET_DIR="./src/${YEAR}/day${DAY}"

# Create index.ts file in the target directory
INDEX_FILE="${TARGET_DIR}/index.ts"
if [ ! -f "$INDEX_FILE" ]; then
    echo "Creating index.ts in $TARGET_DIR"
    cat > "$INDEX_FILE" <<EOL
// https://adventofcode.com/${YEAR}/day/${DAY}

import { readFileSync } from 'fs';

const solution = solve(readLines(\`\${__dirname}/input.txt\`));
console.log(solution);

function readLines(inputFilePath: string) {
  const input = readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines: string[]) {
  console.log(inputLines);
  return {
    part1: undefined,
  };
}
EOL
fi

# Create test_input.txt file in the target directory
TEST_INPUT_FILE="${TARGET_DIR}/test_input.txt"
if [ ! -f "$TEST_INPUT_FILE" ]; then
    echo "Creating test_input.txt in $TARGET_DIR"
    cat > "$TEST_INPUT_FILE" <<EOL
# Test input for Advent of Code ${YEAR} Day ${DAY_RAW}
EOL
fi

echo "Setup complete for Year: $YEAR, Day: $DAY_RAW."

cd "./src/${YEAR}" || exit

# Run the npm watch command with the correct day number (padded)
echo "Running npm run watch for day${DAY}..."
npm run watch "day${DAY}"
