# Contributing to ladybird.org

When contributing to Ladybird, make sure that the changes you wish to make are in line with the project direction. If you are not sure about this, open an issue first, so we can discuss it.

**For your first couple of PRs, start with something small to get familiar with the project and its development processes. Please do not start by adding a large component.**

Everyone is welcome to work on the project, and while we have lots of fun, it's a serious kind of fun. :^)

## Communication

Join [our Discord server](https://discord.gg/nvfjVJ4Svh) to participate in development discussion.

## Issue policy

Please file any bugs you find, keeping the following in mind:

- One issue per bug. Putting multiple things in the same issue makes both discussion and completion unnecessarily complicated.
- No build issues (or other support requests). If the GitHub Actions CI build succeeds, the build problem is most likely on your side. Work it out locally, or ask in the `#website` channel on Discord.
- Don't comment on issues just to add a joke or irrelevant commentary. Hundreds of people get notified about comments so let's keep them relevant.

## Project governance

The Ladybird project is driven by the [Ladybird Browser Initiative](https://ladybird.org/), a 501(c)(3) non-profit organization.

Pull requests are approved and merged by a group of maintainers. The current group of maintainers are (in alphabetical order):

- [Ali Mohammad Pur (@alimpfard)](https://github.com/alimpfard)
- [Aliaksandr Kalenik (@kalenikaliaksandr)](https://github.com/kalenikaliaksandr)
- [Andreas Kling (@awesomekling)](https://github.com/awesomekling)
- [Andrew Kaster (@ADKaster)](https://github.com/ADKaster)
- [Dániel Bertalan (@BertalanD)](https://github.com/BertalanD)
- [Jelle Raaijmakers (@GMTA)](https://github.com/gmta)
- [Luke Wilde (@Lubrsi)](https://github.com/Lubrsi)
- [Sam Atkins (@AtkinsSJ)](https://github.com/AtkinsSJ)
- [Shannon Booth (@shannonbooth)](https://github.com/shannonbooth)
- [Tim Flynn (@trflynn89)](https://github.com/trflynn89)
- [Tim Ledbetter (@tcl3)](https://github.com/tcl3)

## Human language policy

In Ladybird, we treat human language as seriously as we do programming language.

The following applies to all user-facing strings, code, comments, and commit messages:

- The official project language is American English with ISO 8601 dates and metric units.
- Use proper spelling, grammar, and punctuation.
- Write in an authoritative and technical tone.
- Avoid contractions, slang, and idioms.
- Avoid humor, sarcasm, and other forms of non-literal language.
- Use gender-neutral pronouns, except when referring to a specific person.

Note that this also applies to debug logging and other internal strings, as they may be exposed to users in the future.

## Code submission policy

Nobody is perfect, and sometimes we mess things up. That said, here are some good do's & don'ts to try and stick to:

**Do:**

- Choose expressive variable, function and class names. Make it as obvious as possible what the code is doing.
- Split your changes into separate, atomic commits (i.e. A commit per feature or fix, where the build, tests and the system are all functioning).
- Make sure your commits are rebased on the master branch.
- Wrap your commit messages at 72 characters.
- The first line of the commit message is the subject line, and must have the format "Category: Brief description of what's being changed". The category should be the name of a library, application, service, utility, etc.
  - Examples: `LibMedia`, `WebContent`, `CI`, `AK`, `RequestServer`, `js`
  - Don't use a category like "`Libraries`" or "`Utilities`", except for generic changes that affect a large portion of code within these directories.
  - Don't use specific component names, e.g. C++ class names, as the category either - mention them in the summary instead. E.g. `LibGUI: Brief description of what's being changed in FooWidget` rather than `FooWidget: Brief description of what's being changed`
  - Several categories may be combined with `+`, e.g. `LibJS+LibWeb+Browser: ...`
- Write the commit message subject line in the imperative mood ("Foo: Change the way dates work", not "Foo: Changed the way dates work").
- Write your commit messages in proper English, with care and punctuation.
- Amend your existing commits when adding changes after a review, where relevant.
- Mark each review comment as "resolved" after pushing a fix with the requested changes.
- Add your personal copyright line to files when making substantive changes. (Optional but encouraged!)
- Check the spelling of your code, comments and commit messages.

**Don't:**

- Submit changes that are incompatible with the project licence (2-clause BSD.)
- Touch anything outside the stated scope of the PR.
- Iterate excessively on your design across multiple commits.
- Use weasel-words like "refactor" or "fix" to avoid explaining what's being changed.
- End commit message subject lines with a period.
- Include commented-out code.
- Attempt large architectural changes until you are familiar with the project and have worked on it for a while.
- Engage in excessive "feng shui programming" by moving code around without quantifiable benefit.
- Add jokes or other "funny" things to user-facing parts of the project.

## On usage of AI and LLMs

Usage of AI assistance is usually fine, but you are responsible for making sure the quality of the output is up to the
standards of the project. Currently, AI-generated output is often too verbose and its quality is subpar compared to what
most human contributors produce.

Do not use an AI or LLM to generate changes, respond to issues or interact with PRs without holding the output to the
same standards as human-written content.

## Pull Request Q&A

### I've submitted a PR and it passes CI. When can I expect to get some review feedback?

While unadvertised PRs may get randomly merged by curious maintainers, you will have a much smoother time if you engage with the community on Discord.

### If my PR isn't getting attention, how long should I wait before pinging one of the project maintainers?

Ping them right away if it's something urgent! If it's less urgent, advertise your PR on Discord (`#code-review`) and ask if someone could review it.

### Is Discord the place to ask for review help, or is GitHub preferred?

It's definitely better to ask on Discord. Due to the volume of GitHub notifications, many of us turn them off and rely on Discord for learning about review requests.

## Commit Hooks

The repository contains a file called `.pre-commit-config.yaml` that defines a 'commit hook' that can be run automatically just after creating a new commit. This hook lints your commit messages to ensure they will pass the automated CI for pull requests.
To enable these hooks first follow the installation instructions available at https://pre-commit.com/#install and then enable the hook:

- post-commit hook - Lints the commit message to ensure it will pass the commit linting:
  ```console
  pre-commit install --hook-type commit-msg
  ```

## On abandoned pull requests

Sometimes good PRs get abandoned by the author for one reason or another. If the PR is fundamentally good, but the author is not responding to requests, the PR may be manually integrated with minor changes to code and commit messages.

To make this easier, we do appreciate it if folks enable the "Allow edits from maintainers" flag on their pull requests.

## On neutrality

Our goal is to build a browser for everyone, irrespective of their specific opinions and worldviews.
To achieve this, we strive to set our differences aside and focus on the shared goal of building the browser.

This means:

- We welcome contributions from anyone who is committed to the project's goals and respects the collaborative environment.
- Our discussions and work will remain strictly related to browser development and web standards. We do not take positions on issues outside this scope.
- The project will not be used as a platform to advertise or promote causes unrelated to browser development or web standards.
- To maintain a focused and productive environment, discussions on societal politics and other divisive topics are discouraged in project spaces.

We encourage everyone to share their personal views and opinions outside project spaces. However, please keep project spaces focused on project goals.

## On bad-faith contributions and brigading

We reserve the right to reject issues and pull requests that appear to be motivated by bad faith.

Additionally, anyone found participating in social media brigading of Ladybird will be permanently banned from the project.
