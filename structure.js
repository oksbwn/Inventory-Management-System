#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Utility to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read arguments with defaults
const PROJECT_ROOT = process.argv[2] || '.';
const OUTPUT_FILE = process.argv[3] || 'PROJECT_STRUCTURE.md';
const MAX_DEPTH = process.argv[4] ? parseInt(process.argv[4], 10) : Infinity;

const EXCLUDE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '__pycache__', '.vscode', '.idea', 'coverage']);
const EXCLUDE_EXTS = new Set(['.log', '.tmp', '.cache', '.DS_Store', '.env', '.env.local']);

function formatSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(1)} ${units[i]}`;
}

function shouldExcludeDir(name) {
  return EXCLUDE_DIRS.has(name) || name.startsWith('.');
}

function shouldExcludeFile(name) {
  return EXCLUDE_EXTS.has(path.extname(name));
}

function walk(dirPath, depth = 0, prefix = '') {
  if (depth > MAX_DEPTH) return [];

  let entries;
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }

  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  const lines = [];

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const extension = isLast ? '    ' : '│   ';
    const name = entry.name;

    if (entry.isDirectory()) {
      if (shouldExcludeDir(name)) return;
      lines.push(prefix + connector + '**' + name + '/**');
      lines.push(...walk(path.join(dirPath, name), depth + 1, prefix + extension));
    } else if (entry.isFile()) {
      if (shouldExcludeFile(name)) return;
      const size = fs.statSync(path.join(dirPath, name)).size;
      lines.push(prefix + connector + name + ' *(' + formatSize(size) + ')*');
    }
  });

  return lines;
}


(async () => {
  const rootName = path.basename(path.resolve(PROJECT_ROOT));
  const header = [
    '# Project Structure: ' + rootName,
    '',
    '**Root Path:** `' + path.resolve(PROJECT_ROOT) + '`',
    '**Generated:** ' + OUTPUT_FILE,
    '',
    '---',
    '',
    '## Directory Tree',
    '',
    '`' + '`' + '`',  // split backticks to avoid syntax issues
    rootName + '/'
  ];

  const treeLines = walk(PROJECT_ROOT);

  const footer = [
    '`' + '`' + '`', // end code fence split too
    '',
    '---',
    '',
    '## Excluded Directories',
    '',
    ...Array.from(EXCLUDE_DIRS).map(d => '- `' + d + '`'),
    '',
    '## Excluded File Extensions',
    '',
    ...Array.from(EXCLUDE_EXTS).map(e => '- `' + e + '`')
  ];

  const markdown = header.concat(treeLines, footer).join('\n');

  await fs.promises.writeFile(OUTPUT_FILE, markdown, 'utf8');
  console.log(`✔ Project structure saved to ${OUTPUT_FILE}`);
})();
