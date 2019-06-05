import * as path from "path";
import * as vscode from "vscode";
import TelemetryReporter from "vscode-extension-telemetry";

let reporter: TelemetryReporter;

export function activate(context: vscode.ExtensionContext) {
  const extensionId = "color-pick";
  const version = "0";
  const key = "4a812e02-fb45-447f-a2bc-42bf98535773";
  reporter = new TelemetryReporter(extensionId, version, key);
  context.subscriptions.push(
    vscode.commands.registerCommand("pick-color", () => {
      ReactPanel.createOrShow(
        context.extensionPath,
        context.globalState,
        reporter
      );
    })
  );
}

export function deactivate() {
  reporter.dispose();
}

const defaultState = {
  color: {
    hex: "#194D33",
    rgb: {
      a: 1,
      b: 65,
      g: 255,
      r: 0
    }
  },
  mode: "rgba"
};

/**
 * Manages react webview panels
 */
class ReactPanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: ReactPanel | undefined;

  private static readonly viewType = "color-pick";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionPath: string;
  private _globalState: vscode.Memento;
  private _disposables: vscode.Disposable[] = [];

  public static async createOrShow(
    extensionPath: string,
    globalState: vscode.Memento,
    reporter: TelemetryReporter
  ) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;
    const initialState = await globalState.get("app");
    // If we already have a panel, show it.
    // Otherwise, create a new panel.
    if (ReactPanel.currentPanel) {
      ReactPanel.currentPanel._panel.reveal(column);
    } else {
      ReactPanel.currentPanel = new ReactPanel(
        extensionPath,
        globalState,
        initialState || defaultState,
        column || vscode.ViewColumn.One,
        reporter
      );
    }
  }

  private constructor(
    extensionPath: string,
    globalState: vscode.Memento,
    initialState: object,
    column: vscode.ViewColumn,
    reporter: TelemetryReporter
  ) {
    this._extensionPath = extensionPath;
    this._globalState = globalState;
    // Create and show a new webview panel
    this._panel = vscode.window.createWebviewPanel(
      ReactPanel.viewType,
      "Color Pick",
      column,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restric the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [
          vscode.Uri.file(path.join(this._extensionPath, "build"))
        ]
      }
    );

    // Set the webview's initial html content
    this._panel.webview.html = this._getHtmlForWebview(initialState);

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case "colorChanged":
            const {
              mode,
              color: {
                rgb: { r, g, b, a },
                hex
              }
            } = message;
            reporter.sendTelemetryEvent("colorChanged", {
              mode,
              hex,
              rgb: `${r},${g},${b},${a}`
            });
            this._globalState.update("app", {
              color: message.color,
              mode: message.mode
            });
            const colorString =
              mode === "hex" ? hex : `rgba(${r},${g},${b},${a})`;
            vscode.window.showInformationMessage(
              `${colorString} copied to clipboard`
            );
        }
      },
      null,
      this._disposables
    );
  }

  public doRefactor() {
    // Send a message to the webview webview.
    // You can send any JSON serializable data.
    this._panel.webview.postMessage({ command: "refactor" });
  }

  public dispose() {
    ReactPanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private _getHtmlForWebview(initialState: {}) {
    const manifest = require(path.join(
      this._extensionPath,
      "build",
      "asset-manifest.json"
    ));
    const mainScript = manifest["main.js"];

    const scriptPathOnDisk = vscode.Uri.file(
      path.join(this._extensionPath, "build", mainScript)
    );
    const scriptUri = scriptPathOnDisk.with({ scheme: "vscode-resource" });

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<meta name="theme-color" content="#000000">
				<title>Color Pick</title>
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';style-src vscode-resource: 'unsafe-inline' http: https: data:;">
				<base href="${vscode.Uri.file(path.join(this._extensionPath, "build")).with({
          scheme: "vscode-resource"
        })}/">
			</head>
			<body>
				<noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
        <script nonce="${nonce}" >
          INITIAL_COLOR_PICKER_DATA = ${JSON.stringify(initialState)}
        </script> 
				<script nonce="${nonce}" src="${scriptUri}"></script>
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
