#!/bin/bash

# Script to update the language and LOC badges in README.md

# Function to count lines in files
count_lines() {
    find . \( "$@" \) -not -path "./node_modules/*" -exec wc -l {} + 2>/dev/null | tail -1 | awk '{print $1}'
}

# Get line counts
ts_lines=$(count_lines -name "*.ts" -o -name "*.tsx")
js_lines=$(count_lines -name "*.js" -o -name "*.jsx")
sh_lines=$(count_lines -name "*.sh")
total_lines=$((ts_lines + js_lines + sh_lines))

# Calculate percentages (rounded to nearest integer)
ts_percent=$(( (ts_lines * 100 + total_lines / 2) / total_lines ))
js_percent=$(( (js_lines * 100 + total_lines / 2) / total_lines ))
sh_percent=$(( (sh_lines * 100 + total_lines / 2) / total_lines ))

# Update README.md using sed (macOS compatible)
sed -i '' \
    -e "s/TypeScript-[0-9]\+%/TypeScript-${ts_percent}%/g" \
    -e "s/JavaScript-[0-9]\+%/JavaScript-${js_percent}%/g" \
    -e "s/Shell-[0-9]\+%/Shell-${sh_percent}%/g" \
    -e "s/LOC-[0-9][0-9]*/LOC-${total_lines}/g" \
    README.md

echo "Badges updated:"
echo "TypeScript: ${ts_percent}% (${ts_lines} lines)"
echo "JavaScript: ${js_percent}% (${js_lines} lines)"
echo "Shell: ${sh_percent}% (${sh_lines} lines)"
echo "Total LOC: ${total_lines}"