# Commit Convention

[semantic-release](https://github.com/semantic-release/semantic-release) uses the commit messages to determine the type of changes in the codebase. Following formalized conventions for commit messages, semantic-release automatically determines the next [semantic version](https://semver.org/) number, generates a changelog and publishes the release.

Each commit message consists of a **header**, a **body**, and a **footer**.

```bash
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

## Commit Message Header

```bash
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope. describe the changes scope
  │
  │
  │
  │
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test
  
```
The <type> and <summary> fields are mandatory, the (<scope>) field is optional.

### Type

Must be one of the following:

**build:** Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
**ci:** Changes to our CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)
**docs:** Documentation only changes
**feat:** A new feature
**fix:** A bug fix
**perf:** A code change that improves performance
**refactor:** A code change that neither fixes a bug nor adds a feature
**test:** Adding missing tests or correcting existing tests

## Commit Message Body

Just as in the summary, use the imperative, present tense: "fix" not "fixed" nor "fixes".

Explain the motivation for the change in the commit message body. This commit message should explain why you are making the change. You can include a comparison of the previous behavior with the new behavior in order to illustrate the impact of the change.

## Commit Message Footer

The footer can contain information about breaking changes and is also the place to reference GitHub issues, Jira tickets, and other PRs that this commit closes or is related to.

```bash
BREAKING CHANGE: <breaking change summary>
<BLANK LINE>
<breaking change description + migration instructions>
<BLANK LINE>
<BLANK LINE>
Fixes #<issue number>
```

Breaking Change section should start with the phrase "BREAKING CHANGE: " followed by a summary of the breaking change, a blank line, and a detailed description of the breaking change that also includes migration instructions.

**Note:** a commit containing a Breaking changes will bump your version to a new release eg: from 2.1.3 to 3.0.0 
