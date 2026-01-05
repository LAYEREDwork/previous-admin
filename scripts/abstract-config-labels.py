#!/usr/bin/env python3
import re
import os
from pathlib import Path

def abstract_label(label: str) -> str:
    """Intelligently abstract verbose parameter labels to concise ones."""
    # Remove trailing period
    result = label.rstrip('.')
    
    # Clean up multiple periods first
    result = re.sub(r'\.+', '.', result)
    
    # Handle "Whether to enable X" -> "Enable X"
    if result.lower().startswith('whether to '):
        result = result[11:]  # Remove "Whether to "
        result = result[0].upper() + result[1:]
    
    # Handle "Whether X is/are Y" -> "X is/are Y"
    elif result.lower().startswith('whether '):
        result = result[8:]  # Remove "Whether "
        result = result[0].upper() + result[1:]
    
    # Handle sentence separator at period-space boundary
    # Split into sentences
    sentences = re.split(r'(?<=[.!?])\s+', result)
    processed_sentences = []
    
    for sentence in sentences:
        # Clean up content codes (MONITOR_TYPE_DIMENSION -> Monitor type dimension)
        sentence = re.sub(r'([A-Z])([A-Z]+)_([A-Z])', r'\1\2 \3', sentence)  # CAP_CAP -> CAP CAP
        sentence = re.sub(r'([A-Z]+)_([A-Z])', r'\1 \2', sentence)  # CAP_CAP -> CAP CAP
        sentence = re.sub(r'_', ' ', sentence)  # Replace underscores
        
        words = sentence.split(' ')
        processed_words = []
        
        for index, word in enumerate(words):
            # Skip empty words
            if not word:
                continue
            
            # Preserve acronyms
            if re.match(r'^(MB|SCSI|DRAM|ROM|FPU|LED|CPU|CD-ROM|HD|ID|POT|I860|M68K|SRAM|NBIC|ADB|NFS|PCAP|MHz|BIOS|UEFI)$', word, re.IGNORECASE):
                processed_words.append(word.upper())
            # First word always capitalized
            elif index == 0 or (index > 0 and len(processed_words) == 0):
                processed_words.append(word[0].upper() + word[1:].lower())
            # Keep small words lowercase
            elif re.match(r'^(to|in|at|of|or|and|the|with|for|by|as|if|is|are|a|an)$', word, re.IGNORECASE):
                processed_words.append(word.lower())
            # Other words: capitalize
            else:
                processed_words.append(word[0].upper() + word[1:].lower())
        
        processed_sentences.append(' '.join(processed_words))
    
    result = '. '.join(processed_sentences)
    
    # Fix acronyms again (case-insensitive)
    result = re.sub(r'\bMb\b', 'MB', result)
    result = re.sub(r'\bScsi\b', 'SCSI', result)
    result = re.sub(r'\bDram\b', 'DRAM', result)
    result = re.sub(r'\bMhz\b', 'MHz', result)
    result = re.sub(r'\bRom\b', 'ROM', result)
    result = re.sub(r'\bFpu\b', 'FPU', result)
    result = re.sub(r'\bLed\b', 'LED', result)
    result = re.sub(r'\bCpu\b', 'CPU', result)
    result = re.sub(r'\bCdrom\b', 'CD-ROM', result, flags=re.IGNORECASE)
    result = re.sub(r'\bCd-rom\b', 'CD-ROM', result, flags=re.IGNORECASE)
    result = re.sub(r'\bHd\b', 'HD', result)
    result = re.sub(r'\bId\b', 'ID', result)
    result = re.sub(r'\bPot\b', 'Power-On Test', result)
    result = re.sub(r'\bI860\b', 'I860', result)
    result = re.sub(r'\bM68k\b', 'M68K', result)
    result = re.sub(r'\bBios\b', 'BIOS', result)
    result = re.sub(r'\bUefi\b', 'UEFI', result)
    
    # Clean up spaces
    result = re.sub(r'\s+', ' ', result).strip()
    
    return result


def process_locale_file(filepath: str) -> tuple[int, list[tuple[str, str, str]]]:
    """Process a single i18n file and return transformations."""
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Find the parameters section
    match = re.search(r"'parameters':\s*\{([\s\S]*?)'configEditor\.parameters\.", content)
    if not match:
        return 0, []
    
    param_section = match.group(1)
    transformations = []
    
    # Find all 'key': 'value' pairs
    for m in re.finditer(r"'([^']+)':\s*'([^']*)'", param_section):
        key, value = m.groups()
        
        # Skip if value is just a copy of the key
        if value == key:
            continue
        
        new_value = abstract_label(value)
        
        # Only store if there's a change
        if new_value != value:
            transformations.append((key, value, new_value))
    
    # Apply transformations
    new_content = content
    for key, old_value, new_value in transformations:
        # Escape special regex characters
        escaped_old = re.escape(old_value)
        pattern = f"('{key}':\\s*)'{escaped_old}'"
        replacement = f"\\1'{new_value}'"
        new_content = re.sub(pattern, replacement, new_content)
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as file:
        file.write(new_content)
    
    return len(transformations), transformations


def main():
    locales_dir = Path(__file__).parent.parent / 'frontend' / 'lib' / 'i18n' / 'locales'
    languages = ['en.ts', 'de.ts', 'es.ts', 'fr.ts', 'it.ts']
    
    print('🔄 Abstracting config parameter labels...\n')
    
    total_transforms = 0
    
    for lang in languages:
        filepath = locales_dir / lang
        if not filepath.exists():
            print(f'⚠️  File not found: {lang}')
            continue
        
        print(f'📝 Processing {lang}...')
        count, transforms = process_locale_file(str(filepath))
        
        if count == 0:
            print(f'   ℹ️  No changes needed\n')
            continue
        
        print(f'   ✅ Applied {count} transformations:')
        for key, old, new in transforms[:5]:
            print(f'      • {key}')
            print(f'        Before: {old}')
            print(f'        After:  {new}')
        
        if count > 5:
            print(f'      ... and {count - 5} more')
        
        total_transforms += count
        print()
    
    print(f'\n✨ Done! Applied {total_transforms} label transformations total.')


if __name__ == '__main__':
    main()

