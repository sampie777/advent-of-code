#!/bin/bash
echo "Generating day $1 from template..."

echo "$(sed 's/dayxx/day'$1'/g' src/dayxx.ts.template)" > "src/day$1.ts"
echo "" > "src/inputs/day$1.txt"
echo "" > "src/inputs/day$101_test.txt"
echo "" > "src/inputs/day$102_test.txt"

git add "src/day$1.ts"