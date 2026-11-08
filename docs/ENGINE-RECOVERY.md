# Reliability Engines — 0.3.0

## Witness

Inspection remains explicit and read-only. The scanner loads root and nested .gitignore files as it enters each directory. Ignore rules are applied in file order and in directory ancestry order; an ignored parent cannot be reopened by a child negation. Core parser behavior covers anchored patterns, basename patterns, globstar, directory-only rules, escaped leading comment/negation markers, and negation.

The scanner collects the Git root, current branch, and a bounded `git status --short --branch` result using non-shell Git invocations with timeouts. When Git is unavailable or the folder is not in a repository, the report says so.

Text content is cached in memory for the current extension session. File device/inode, size, mtime, and ctime are checked before reuse. A prior-scan snapshot reports added, changed, and removed paths. Cache state is not persisted and is not a substitute for a full fresh scan.

File reads reject symbolic links and hard links, open with `O_NOFOLLOW` where supported, compare the opened inode with the pre-open metadata, and check resolved paths against the workspace root before reading.

## Forge transaction lifecycle

Each approved multi-file patch writes a journal and backups to VS Code global extension storage before replacing workspace files. A file is staged in its own target directory and replaced atomically (updates use rename; creates use an exclusive hard link). After each successful replacement, the journal is updated.

If an operation fails, Forge rolls back files whose current hash still equals the transaction's expected after-hash. Files already at their before-hash are left alone. Files matching neither snapshot are treated as conflicts and are never overwritten automatically.

When VS Code starts and an incomplete journal exists, the extension offers a recovery action. Recovery is never applied without a separate user confirmation. Journals and backups are retained after completion for auditability.

This provides recoverable per-file writes and rollback; it does not claim a cross-file filesystem atomic commit. Portable Node APIs cannot guarantee compare-and-swap against every hostile concurrent writer.

## Proof matrix

A passed command creates a proof record with command, cwd, timestamps, duration, exit code, status, and bounded redacted output. After a passing run, the user may select the acceptance criteria that the run actually supports and must confirm the mapping after reviewing the output.

The matrix aggregates mappings from all passing evidence records for that mission. An entry counts only when its criterion index and exact text still match the mission, and the review is explicitly confirmed. Failed, cancelled, stale-text, or unreviewed evidence does not count.

All criteria must have at least one mapped passing record before the extension offers the separate **Mark Verified** confirmation. A user can keep a complete matrix in Implemented state without marking the mission Verified.
