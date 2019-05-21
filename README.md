# [VSCode Color Pick](https://marketplace.visualstudio.com/items?itemName=adam-watters.vscode-color-pick)

## Features

Open a color picker from any file with the 'Pick Color' command. Choose between #hex and rgba() format. Selected color is added to clipboard. More features coming soon!

![demo animation](./demo.gif)

## Changelog

### [0.3.2]

- add .vscodeignore, reduced extension size by several orders of magnitude

### [0.3.1]

- bug fix: color state persists when color picker window is left open

### [0.3.0]

- persist color picker state in globalState

### [0.2.0]

- added support for `rgba(#,#,#,#)` format

### [0.1.0]

- intital release: open with `Pick Color` command, copy hex to clipboard

## Contributing

[Github Repository](https://github.com/adamwatters/vscode-color-pick)

This project uses [vscode-webview-react](https://github.com/rebornix/vscode-webview-react).

To start developing

```
yarn install
yarn run build
```

[Follow the instruction](https://github.com/rebornix/vscode-webview-react) in the VSCode docs to run the extension in a Extension Development Host
