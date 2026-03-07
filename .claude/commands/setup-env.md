---
allowed-tools: Read, Write, Bash(grep:*)
---

Check if a `.env` file exists in the project root. If it does, read it and report which variables are set (without revealing values) and which are missing compared to `.env.example`.

If `.env` does not exist, read `.env.example` to get the list of required variables, then ask the user for each value one at a time, explaining what it's used for:

- `USER_NAME` — username for HTTP Basic Auth on the dashboard
- `PASSWORD` — password for HTTP Basic Auth on the dashboard
- `HARVEST_ACCESS_TOKEN` — personal access token from https://id.getharvest.com/developers
- `HARVEST_ACCOUNT_ID` — account ID shown on the same Harvest developers page
- `USER_AGENT_EMAIL` — your email address, sent as User-Agent to the Harvest API
- `PE_ACCOUNTING_ACCOUNT_ID` — (optional) company ID from PE Accounting; leave blank to disable client time reporting
- `PE_ACCOUNTING_TOKEN` — (optional) API token from PE Accounting; leave blank if not using PE Accounting

Once all values are collected, create the `.env` file. Do not commit it — `.env` should be in `.gitignore`.

After creating the file, verify that `.env` is listed in `.gitignore` and warn the user if it is not.
