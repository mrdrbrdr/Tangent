# Git Quick Reference Guide

This guide covers common Git operations for reverting changes and managing your repository.

## 🔄 Reverting Changes

### Discard All Local Changes

When you want to throw away all uncommitted changes and return to your last commit:

```bash
git reset --hard HEAD
```

**What this does:**
- Resets your working directory to match your last commit
- ⚠️ **Warning**: This permanently removes all uncommitted changes

### Get Latest from Remote + Reset

If you want to make sure you have the latest version from GitHub AND reset:

```bash
git fetch origin
git reset --hard origin/main
```


### Key Points:
- When you or others push to GitHub, the remote gets updated
- Your local copy doesn't automatically sync with remote changes
- That's why we sometimes need to `fetch` first

### Reset Command Comparison

| Command | What It Does |
|---------|-------------|
| `git reset --hard HEAD` | Reset to your last **local** commit |
| `git reset --hard origin/main` | Reset to the latest commit on **GitHub** |

## 🗂️ Handling Untracked Files

### Why Some Files Remain After Reset

If files still exist after running `git reset --hard`, they're likely **untracked files** - files Git doesn't know about yet.

- `git reset --hard` only affects **tracked** files
- Untracked files (never added with `git add`) remain untouched

### Remove Untracked Files

```bash
git clean -fd
```

**Flag meanings:**
- `-f` = force (required for safety)
- `-d` = also remove untracked directories

### Preview Before Deleting

To see what will be deleted without actually deleting:

```bash
git clean -fd --dry-run
```

⚠️ **Important**: `git clean -fd` permanently deletes files - they cannot be recovered!