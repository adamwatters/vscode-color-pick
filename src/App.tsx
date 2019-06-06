// tslint:disable:no-console
const vscode = acquireVsCodeApi();
import React from "react";
import { ColorResult, SketchPicker } from "react-color";
import Card from "./Card";
import config from "./config";
import GithubLink from "./GithubLink";
import Search from "./Search";

class App extends React.Component {
  public state = {
    search: "",
    ...(vscode.getState("app") || INITIAL_COLOR_PICKER_DATA)
  };

  constructor(props: {}) {
    super(props);
    this.handleColorChange = this.handleColorChange.bind(this);
  }

  public componentDidUpdate() {
    vscode.setState(this.state);
  }

  public render() {
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          overflow: "hidden"
        }}
      >
        <div
          style={{
            zIndex: 2,
            position: "absolute",
            top: 0,
            bottom: -10,
            overflow: "scroll"
          }}
        >
          <Search
            vscode={vscode}
            setSearch={this.setSearch}
            search={this.state.search}
            searchSelect={this.handleColorChange}
          />
        </div>
        <div
          style={{
            bottom: 0,
            position: "absolute",
            top: 0,
            width: "100%",
            backgroundImage:
              "linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: this.rgbaStringFromState(),
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "absolute",
              top: 0,
              width: "100%"
            }}
            className="Color Pick"
          >
            <GithubLink link={config.repoUrl} />
            <SketchPicker
              presetColors={[]}
              color={this.state.color.rgb}
              onChangeComplete={this.handleColorChange}
            />
            <Card>
              <div>
                <input
                  type="checkbox"
                  checked={this.state.mode === "rgba"}
                  onClick={this.handleRGBAModeClick}
                />
                {` copy as rgba()`}
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={this.state.mode === "hex"}
                  onClick={this.handleHexModeClick}
                />
                {` copy as #hex`}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  private setSearch = (s: string) => {
    this.setState({ search: s });
  };

  private handleRGBAModeClick = () => {
    const { color } = this.state;
    copyToClipboard(this.colorStringFromState("rgba"));
    vscode.postMessage({
      color,
      mode: "rgba",
      command: "colorChanged"
    });
    this.setState({ mode: "rgba" });
  };

  private handleHexModeClick = () => {
    const { color } = this.state;
    copyToClipboard(this.colorStringFromState("hex"));
    vscode.postMessage({
      color,
      mode: "hex",
      command: "colorChanged"
    });
    this.setState({ mode: "hex" });
  };

  private rgbaStringFromState() {
    const { r, g, b, a } = this.state.color.rgb;
    return `rgba(${r},${g},${b},${a})`;
  }

  private colorStringFromState(mode: string) {
    switch (mode) {
      case "rgba":
        return this.rgbaStringFromState();
      case "hex":
        return this.state.color.hex;
      default:
        return this.state.color.hex;
    }
  }

  private handleColorChange(color: ColorResult) {
    this.setState({ color });
    copyToClipboard(this.colorStringFromState(this.state.mode));
    vscode.postMessage({
      color,
      mode: this.state.mode,
      command: "colorChanged"
    });
  }
}

const copyToClipboard = (str: string) => {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

export default App;
