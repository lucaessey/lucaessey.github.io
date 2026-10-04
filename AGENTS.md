# File retention

The user prefers retaining retired files until the desired behavior is confirmed.

- Do not mass-delete project files as cleanup. Move retired files into a dated `deprecated/<YYYY-MM-DD>-<reason>/` folder outside deployed output, preserving their relative paths and adding a short manifest explaining their origin and why they were retired.
- Keep that archive until the user explicitly requests its cleanup. Do not delete it automatically after tests pass.
- Before a bulk update or build that will remove existing files, preserve the affected files in that archive first. Keep private source and credentials out of public deployment archives.
- Never move Git's internal `.git` files into `deprecated` as ordinary project cleanup. Use Git integrity checks to diagnose storage warnings, and disable automatic maintenance for checks when investigating a deletion warning. Do not run object-pruning or garbage-collection cleanup without an explicit cleanup request.
