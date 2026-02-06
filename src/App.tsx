const vscode = acquireVsCodeApi();

import { useState, useEffect, useRef } from "react";
import { ColorResult, SketchPicker } from "react-color";
import Card from "./Card";
import config from "./config";
import GithubLink from "./GithubLink";
import Search from "./Search";

const initialState = (vscode.getState() ||
  window.INITIAL_COLOR_PICKER_DATA) as {
  color: { hex: string; rgb: { r: number; g: number; b: number; a: number } };
  mode: string;
};

const App = () => {
  const [color, setColor] = useState(initialState.color);
  const [mode, setMode] = useState(initialState.mode);
  const [search, setSearch] = useState("");
  const [copiedMessage, setCopiedMessage] = useState("");
  const [copiedVisible, setCopiedVisible] = useState(false);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showCopiedMessage = (colorStr: string) => {
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    setCopiedMessage(colorStr);
    setCopiedVisible(true);
    fadeTimerRef.current = setTimeout(() => {
      setCopiedVisible(false);
    }, 4000);
  };

  useEffect(() => {
    vscode.setState({ color, mode });
  }, [color, mode]);

  const rgbaString = () => {
    const { r, g, b, a } = color.rgb;
    return `rgba(${r},${g},${b},${a})`;
  };

  const colorString = (m: string) => {
    return m === "rgba" ? rgbaString() : color.hex;
  };

  const handleColorChange = (c: ColorResult) => {
    setColor(c);
    const str = mode === "rgba"
      ? `rgba(${c.rgb.r},${c.rgb.g},${c.rgb.b},${c.rgb.a})`
      : c.hex;
    showCopiedMessage(str);
    vscode.postMessage({
      color: c,
      mode,
      command: "colorChanged",
    });
  };

  const handleRGBAModeClick = () => {
    const { r, g, b, a } = color.rgb;
    showCopiedMessage(`rgba(${r},${g},${b},${a})`);
    vscode.postMessage({
      color,
      mode: "rgba",
      command: "colorChanged",
    });
    setMode("rgba");
  };

  const handleHexModeClick = () => {
    showCopiedMessage(color.hex);
    vscode.postMessage({
      color,
      mode: "hex",
      command: "colorChanged",
    });
    setMode("hex");
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          zIndex: 2,
          position: "absolute",
          top: 0,
          bottom: -10,
          overflow: "scroll",
        }}
      >
        <Search
          setSearch={setSearch}
          search={search}
          searchSelect={handleColorChange}
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
          alignItems: "center",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: rgbaString(),
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "absolute",
            top: 0,
            width: "100%",
          }}
          className="Color Pick"
        >
          <GithubLink link={config.repoUrl} />
          <div style={{ position: "relative" }}>
            {copiedMessage && (
              <div
                style={{
                  position: "absolute",
                  bottom: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  padding: "6px 14px",
                  marginBottom: 8,
                  background: "rgba(0,0,0,0.7)",
                  color: "#fff",
                  borderRadius: 4,
                  fontSize: 13,
                  fontFamily: "monospace",
                  whiteSpace: "nowrap",
                  opacity: copiedVisible ? 1 : 0,
                  transition: "opacity 0.5s ease-out",
                  pointerEvents: "none",
                }}
              >
                {copiedMessage} copied
              </div>
            )}
            <SketchPicker
            presetColors={[]}
            color={color.rgb}
            onChangeComplete={handleColorChange}
          />
          </div>
          <Card>
            <div>
              <input
                type="checkbox"
                checked={mode === "rgba"}
                onClick={handleRGBAModeClick}
                readOnly
              />
              {" copy as rgba()"}
            </div>
            <div>
              <input
                type="checkbox"
                checked={mode === "hex"}
                onClick={handleHexModeClick}
                readOnly
              />
              {" copy as #hex"}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default App;
