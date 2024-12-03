#!/usr/bin/bash

YEAR=$(date +%Y)
DAY=$1
PADDED_DAY=$(printf %02d $DAY)

echo "Generating day ${DAY} of $YEAR from template..."

echo "$(sed 's/YEAR/'$YEAR'/g' src/dayxx.ts | sed 's/DAY/'$DAY'/g')" > "src/${YEAR}day${PADDED_DAY}.ts"

git add "src/${YEAR}day${PADDED_DAY}.ts"
