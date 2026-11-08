const BACKSLASH = String.fromCharCode(92);
const REGEX_META = new Set(['.', '*', '+', '?', '^', String.fromCharCode(36), '{', '}', '(', ')', '|', '[', ']', BACKSLASH]);

function escapeRegex(value) {
  return [...value].map((char) => REGEX_META.has(char) ? BACKSLASH + char : char).join('');
}

function unescapePattern(value) {
  let output = '';
  for (let index = 0; index < value.length; index += 1) {
    if (value[index] === BACKSLASH && index + 1 < value.length && [' ', '#', '!', BACKSLASH].includes(value[index + 1])) {
      output += value[index + 1];
      index += 1;
    } else {
      output += value[index];
    }
  }
  return output;
}

function globExpression(pattern) {
  let output = '';
  for (let index = 0; index < pattern.length; index += 1) {
    const char = pattern[index];
    if (char === BACKSLASH && index + 1 < pattern.length) {
      output += escapeRegex(pattern[index + 1]);
      index += 1;
    } else if (char === '*' && pattern[index + 1] === '*') {
      index += 1;
      if (pattern[index + 1] === '/') {
        index += 1;
        output += '(?:.*/)?';
      } else {
        output += '.*';
      }
    } else if (char === '*') {
      output += '[^/]*';
    } else if (char === '?') {
      output += '[^/]';
    } else if (char === '[') {
      const end = pattern.indexOf(']', index + 1);
      if (end > index + 1) {
        let group = pattern.slice(index + 1, end);
        if (group.startsWith('!')) group = '^' + group.slice(1);
        output += '[' + group + ']';
        index = end;
      } else {
        output += BACKSLASH + '[';
      }
    } else {
      output += escapeRegex(char);
    }
  }
  return output;
}

export function parseGitignore(content, base = '') {
  const rules = [];
  const source = String(content ?? '');
  const normalized = source.charCodeAt(0) === 0xFEFF ? source.slice(1) : source;
  for (let raw of normalized.split(String.fromCharCode(10))) {
    if (raw.endsWith(String.fromCharCode(13))) raw = raw.slice(0, -1);
    if (!raw) continue;
    if (raw.startsWith(BACKSLASH + '#')) raw = raw.slice(1);
    else if (raw.startsWith('#')) continue;
    let negated = false;
    if (raw.startsWith(BACKSLASH + '!')) raw = raw.slice(1);
    else if (raw.startsWith('!')) { negated = true; raw = raw.slice(1); }
    while (raw.endsWith(' ') && !raw.endsWith(BACKSLASH + ' ')) raw = raw.slice(0, -1);
    if (!raw) continue;
    let pattern = unescapePattern(raw);
    const anchored = pattern.startsWith('/');
    if (anchored) pattern = pattern.slice(1);
    const directoryOnly = pattern.endsWith('/');
    if (directoryOnly) pattern = pattern.slice(0, -1);
    if (!pattern) continue;
    const hasSlash = anchored || pattern.includes('/');
    const body = globExpression(pattern);
    const regex = new RegExp(hasSlash ? '^' + body + '$' : '(?:^|/)' + body + '$');
    const normalizedBase = String(base).split(BACKSLASH).join('/').replace(/^\.\//, '').replace(/\/$/, '');
    rules.push({ base: normalizedBase, negated, directoryOnly, regex, pattern });
  }
  return rules;
}

export function isGitIgnored(relativePath, isDirectory, ruleSets = []) {
  const normalized = String(relativePath ?? '').split(BACKSLASH).join('/').replace(/^\.\//, '').replace(/\/$/, '');
  if (!normalized) return false;
  const segments = normalized.split('/').filter(Boolean);
  let prefix = '';
  for (let index = 0; index < segments.length; index += 1) {
    prefix = prefix ? prefix + '/' + segments[index] : segments[index];
    const prefixIsDirectory = index < segments.length - 1 || isDirectory;
    let ignored = false;
    for (const ruleSet of ruleSets) {
      const base = ruleSet.base ?? '';
      if (base && prefix !== base && !prefix.startsWith(base + '/')) continue;
      if (prefix === base) continue;
      const candidate = base ? prefix.slice(base.length + 1) : prefix;
      for (const rule of ruleSet.rules ?? []) {
        if (rule.directoryOnly && !prefixIsDirectory) continue;
        if (rule.regex.test(candidate)) ignored = !rule.negated;
      }
    }
    if (ignored) return true;
  }
  return false;
}
