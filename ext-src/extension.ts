import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("pick-color", () => {
      ReactPanel.createOrShow(context.extensionPath, context.globalState);
    })
  );
}

export function deactivate() {}

const defaultState = {
  color: {
    hex: "#194D33",
    rgb: {
      a: 1,
      b: 65,
      g: 255,
      r: 0,
    },
  },
  mode: "rgba",
};

class ReactPanel {
  public static currentPanel: ReactPanel | undefined;

  private static readonly viewType = "color-pick";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionPath: string;
  private _globalState: vscode.Memento;
  private _disposables: vscode.Disposable[] = [];

  public static async createOrShow(
    extensionPath: string,
    globalState: vscode.Memento
  ) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;
    const initialState = await globalState.get("app");

    if (ReactPanel.currentPanel) {
      ReactPanel.currentPanel._panel.reveal(column);
    } else {
      ReactPanel.currentPanel = new ReactPanel(
        extensionPath,
        globalState,
        initialState || defaultState,
        column || vscode.ViewColumn.One
      );
    }
  }

  private constructor(
    extensionPath: string,
    globalState: vscode.Memento,
    initialState: object,
    column: vscode.ViewColumn
  ) {
    this._extensionPath = extensionPath;
    this._globalState = globalState;

    this._panel = vscode.window.createWebviewPanel(
      ReactPanel.viewType,
      "Color Pick",
      column,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(this._extensionPath, "build", "webview")),
        ],
      }
    );

    this._panel.webview.html = this._getHtmlForWebview(initialState);

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "colorChanged": {
            const {
              mode,
              color: {
                rgb: { r, g, b, a },
                hex,
              },
            } = message;
            this._globalState.update("app", {
              color: message.color,
              mode: message.mode,
            });
            const colorString =
              mode === "hex" ? hex : `rgba(${r},${g},${b},${a})`;
            vscode.env.clipboard.writeText(colorString).then(() => {
              vscode.window.showInformationMessage(
                `${colorString} copied to clipboard`
              );
            });
            break;
          }
        }
      },
      null,
      this._disposables
    );
  }

  public dispose() {
    ReactPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _getHtmlForWebview(initialState: object) {
    const webviewPath = path.join(
      this._extensionPath,
      "build",
      "webview"
    );
    const manifestPath = path.join(webviewPath, ".vite", "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    const entry = manifest["index.html"];
    const scriptUri = this._panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(webviewPath, entry.file))
    );

    const cssLinks = (entry.css || [])
      .map((cssFile: string) => {
        const cssUri = this._panel.webview.asWebviewUri(
          vscode.Uri.file(path.join(webviewPath, cssFile))
        );
        return `<link rel="stylesheet" href="${cssUri}">`;
      })
      .join("\n");

    const nonce = getNonce();

    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${this._panel.webview.cspSource} https:; script-src 'nonce-${nonce}'; style-src ${this._panel.webview.cspSource} 'unsafe-inline' http: https: data:;">
        <title>Color Pick</title>
        ${cssLinks}
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
        <script nonce="${nonce}">
          window.INITIAL_COLOR_PICKER_DATA = ${JSON.stringify(initialState)};
        </script>
        <script nonce="${nonce}" type="module" src="${scriptUri}"></script>
      </body>
      </html>`;
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
