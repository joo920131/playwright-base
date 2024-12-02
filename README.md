# Playwright Repo

---

This is created for demonstrating Playwright test automation for learning and setting up an example test framework

## Quick Start

```bash
yarn install --frozen-lockfile

yarn test
```

## Repository Structure

The repository is organized as follows:

```
/playwright-repo
├
├── tests/                  # Test files
│   ├── web                 # Web UI test automation tests
│   │   ├── demo-todo-app   # Demo todo app from Playwright
│   └── ...                 # WIP - other types of tests
│
├── lib/                    # Library files
│   ├── constants           # Stores typical constant values (e.g. example todo)
│   ├── fixtures             # Reusable Playwright fixtures leveraging shared test collections and pom object initialisation
│   ├── models              # Types for interfaces and Page Object Models
│   └── utils               # Utilities for reusing useful code
│
└── playwright.config.ts    # Playwright common configuration
```

## To Contribute

The project uses [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/#summary) and uses strict Prettier formatting.

### VSCode

If you are using VSCode, install Prettier extension for auto formatting, and make sure to setup workspace setup:

```bash
mkdir -p .vscode

cat <<-EOF > .vscode/settings.json
{
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
}
EOF
```
