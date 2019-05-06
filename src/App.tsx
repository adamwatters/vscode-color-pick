// tslint:disable:no-console
import * as React from "react";
import { ColorResult, SketchPicker } from "react-color";
import "./App.css";

class App extends React.Component {
  public state = {
    background: "#194D33"
  };

  private vscode = acquireVsCodeApi();

  constructor(props: {}) {
    super(props);
    this.handleChangeComplete = this.handleChangeComplete.bind(this);
  }

  public render() {
    return (
      <div
        style={{
          alignItems: "center",
          background: this.state.background,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          position: "absolute",
          top: 0,
          width: "100%"
        }}
        className="Color Picker"
      >
        <SketchPicker
          color={this.state.background}
          onChangeComplete={this.handleChangeComplete}
        />
      </div>
    );
  }

  private handleChangeComplete(color: ColorResult) {
    this.setState({ background: color.hex });
    this.vscode.postMessage({
      command: "colorChanged",
      hex: color.hex
    });
  }
}

export default App;
