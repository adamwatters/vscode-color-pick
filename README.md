![demo animation](./pick-small.png)
# VSCode Color Pick

## Features

Open a color picker from any file with the 'Pick Color' command. Choose between #hex and rgba() format. Selected color is added to clipboard. More features coming soon!

![demo animation](./demo.gif)

## Changelog

### [0.1.0]
- intital release: open with `Pick Color` command, copy hex to clipboard
  
### [0.2.0]
- added support for `rgba(#,#,#,#)` format

### [0.3.0]
- persist color picker state in globalState

## Contributing

[Github Repository](https://github.com/adamwatters/vscode-color-pick)

This project uses [vscode-webview-react](https://github.com/rebornix/vscode-webview-react).

To start developing

```
yarn install
yarn run build
```

[Follow the instruction](https://github.com/rebornix/vscode-webview-react) in the VSCode docs to run the extension in a Extension Development Host
