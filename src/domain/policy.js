import path from 'node:path';

const BLOCKED_SEGMENTS = new Set([
  '.git', '.svn', '.hg', '.idea', '.vscode-test', '.rocksoul',
  'node_modules', 'bower_components', 'vendor', 'dist', 'build',
  'coverage', '.next', '.nuxt', '.svelte-kit', '.turbo', '.cache',
  '.ssh', '.aws', '.azure', '.config', '.gnupg', 'secrets', 'private'
]);

const BLOCKED_NAMES = [
  /^\.env(?:\..*)?$/i,
  /^\.npmrc$/i,
  /^\.pypirc$/i,
  /^credentials(?:\..*)?$/i,
  /^secrets?(?:\..*)?$/i,
  /\.(?:pem|key|p12|pfx|crt|cer|der)$/i,
  /\.(?:sqlite|sqlite3|db|dump|bak)$/i,
  /(?:id_rsa|id_ed25519|known_hosts)$/i
];

const TEXT_EXTENSIONS = new Set([
  '.md', '.mdx', '.txt', '.json', '.jsonc', '.yaml', '.yml', '.toml',
  '.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx', '.css', '.scss', '.less',
  '.html', '.htm', '.xml', '.svg', '.vue', '.svelte', '.astro',
  '.py', '.pyi', '.rs', '.go', '.java', '.kt', '.kts', '.cs', '.fs',
  '.php', '.rb', '.sh', '.bash', '.zsh', '.ps1', '.sql', '.graphql',
  '.gql', '.proto', '.env.example', '.gitignore', '.dockerignore', '.editorconfig'
]);

const SPECIAL_TEXT_NAMES = new Set([
  'README', 'README.md', 'README.rst', 'LICENSE', 'CHANGELOG.md',
  'CONTRIBUTING.md', 'Dockerfile', 'Makefile', 'Procfile', ' justfile',
  'package.json', 'pnpm-workspace.yaml', 'Cargo.toml', 'go.mod',
  'pyproject.toml', 'requirements.txt', 'Pipfile', 'Gemfile',
  'composer.json', 'pom.xml', 'build.gradle', 'settings.gradle'
]);

export function normalizeRelativePath(value) {
  return String(value ?? '').replaceAll('\\', '/').replace(/^\.\//, '').replace(/\/+$/, '');
}

function matchesCustomPattern(relativePath, patterns) {
  const segments = relativePath.split('/');
  return patterns.some((rawPattern) => {
    const pattern = normalizeRelativePath(rawPattern).trim();
    if (!pattern) return false;
    if (!pattern.includes('*')) return segments.includes(pattern) || relativePath === pattern || relativePath.startsWith(`${pattern}/`);
    const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replaceAll('**', '.*').replaceAll('*', '[^/]*');
    return new RegExp(`(^|/)${escaped}($|/)`, 'i').test(relativePath);
  });
}

export function isExcludedPath(value, customPatterns = []) {
  const relativePath = normalizeRelativePath(value);
  if (!relativePath || relativePath === '.') return false;
  const segments = relativePath.split('/').filter(Boolean);
  if (segments.some((segment) => BLOCKED_SEGMENTS.has(segment.toLowerCase()) || BLOCKED_NAMES.some((pattern) => pattern.test(segment)))) return true;
  return matchesCustomPattern(relativePath, customPatterns);
}

export function isTextCandidate(relativePath) {
  const normalized = normalizeRelativePath(relativePath);
  const name = path.posix.basename(normalized);
  if (SPECIAL_TEXT_NAMES.has(name)) return true;
  if (name.startsWith('README') || name.startsWith('CHANGELOG')) return true;
  if (name === '.gitignore' || name === '.dockerignore' || name === '.editorconfig') return true;
  return TEXT_EXTENSIONS.has(path.posix.extname(name).toLowerCase());
}

export function clampInteger(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(number)));
}

export function isPathInside(root, candidate) {
  const relative = path.relative(path.resolve(root), path.resolve(candidate));
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}
