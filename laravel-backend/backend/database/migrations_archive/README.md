# Archived Migrations

This folder contains legacy iterative migrations that were squashed on 2026-03-29 into a fresh-install baseline under `database/migrations`.

- New installs should run only the migrations in `database/migrations`.
- Existing environments should keep their current database state; do not replay archived files.
- Legacy files are preserved for reference and rollback history.
