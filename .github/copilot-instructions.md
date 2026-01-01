# Copilot Instructions for `previous-admin`

## General Guidelines
- Never use a single character for variable names, parameters, or any identifiers; always use descriptive names.
- Always add comments in code to explain non-trivial parts.
- Always format code with proper indentation and spacing for better readability.
- Always add JSDoc documentation comments for all functions and classes.
- Never change code on your own without my explicit request.
- Always communicate in German when discussing internal logic or UI strings.
- When adding features or making changes, always run linter, typecheck and build commands to ensure code quality. If there are any errors, always fix them before proceeding.

## Custom Commands

- **`:arch`**: Provides a brief summary of the architecture of the current project. If the command is followed by a `>` symbol and a string, write the instructions as Markdown to a file with this name in the project root directory.
- **`:badges`**: Run the script `scripts/update_badges.sh`.
- **`:cm`**: Creates a compact commit message in English for the changes since the last commit. Only recently changed files should be included (`git status`). The message should contain a headline and an unordered list, formatted as plain text in a code block.
- **`:dev-setup`**: Provide step-by-step instructions for setting up the development environment for the current project. If the command is followed by a `>` symbol and a string, write the instructions as Markdown to a file with this name in the project root directory.
- **`:desc`**: Produce a complete functional description of the project, divided into backend and frontend, without technical details, as Markdown. If the command is followed by a `>` symbol and a string, write the text to a file with that name in the project root directory. If the name contains a language suffix such as `.de.md` or `.en.md`, write the description in the corresponding language.
- **`:desct`**: Produce a complete functional description of the project, divided into backend and frontend, with all technical details, as Markdown. If the command is followed by a `>` symbol and a string, write the text to a file with that name in the project root directory. If the name contains a language suffix such as `.de.md` or `.en.md`, write the description in the corresponding language.
- **`:docs <topic>`**: Generate detailed documentation on the specified topic in the context of the current project. The documentation must be in Markdown format and include code examples where appropriate. If the command is followed by a `>` symbol and a string, write the instructions as Markdown to a file with this name in the project root directory. If no topic is specified, generate comprehensive documentation for the entire project.
- **`:ls`**: Output a list of all custom commands that start with ":" as Markdown.
- **`:scan`**: Scan the project’s code and update your context.
- **`:undo`**: Undo the last changes in the code and return to the previous state.