#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

const frontendDir = path.join(projectRoot, 'frontend');
const backendDir = path.join(projectRoot, 'backend');

const extensions = ['.ts', '.tsx', '.js', '.jsx'];

function walk(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results.push(...walk(filePath));
    } else {
      if (extensions.includes(path.extname(filePath))) {
        results.push(filePath);
      }
    }
  });
  return results;
}

function updateFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  replacements.forEach(([from, to]) => {
    content = content.split(from).join(to);
  });
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', path.relative(projectRoot, filePath));
  }
}

const frontendReplacements = [
  ['../../../lib/', '@frontend/lib/'],
  ['../../lib/', '@frontend/lib/'],
  ['../lib/', '@frontend/lib/'],
  ['../../../components/', '@frontend/components/'],
  ['../../components/', '@frontend/components/'],
  ['../components/', '@frontend/components/'],
  ['../../../contexts/', '@frontend/contexts/'],
  ['../../contexts/', '@frontend/contexts/'],
  ['../contexts/', '@frontend/contexts/'],
  ['../../../hooks/', '@frontend/hooks/'],
  ['../../hooks/', '@frontend/hooks/'],
  ['../hooks/', '@frontend/hooks/'],
  ['../../../controls/', '@frontend/components/controls/'],
  ['../../controls/', '@frontend/components/controls/'],
  ['../controls/', '@frontend/components/controls/'],
  ['../../sf-symbols/', '@frontend/components/sf-symbols/'],
  ['../sf-symbols/', '@frontend/components/sf-symbols/'],
  ['../../lib/', '@frontend/lib/'],
];

const backendReplacements = [
  ['../../shared/', '@shared/'],
  ['../shared/', '@shared/'],
  ['../../api/', '@backend/api/'],
  ['../api/', '@backend/api/'],
];

// Process frontend
const frontendFiles = walk(frontendDir);
frontendFiles.forEach(file => updateFile(file, frontendReplacements));

// Process backend
const backendFiles = walk(backendDir);
backendFiles.forEach(file => updateFile(file, backendReplacements));

console.log('Done. Please run lint and typecheck to validate.');
