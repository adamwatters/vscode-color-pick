declare function acquireVsCodeApi(): {
  postMessage: (message: unknown) => void;
  getState: (key?: string) => unknown;
  setState: (state: unknown) => void;
};

interface Window {
  INITIAL_COLOR_PICKER_DATA: {
    color: {
      rgb: { r: number; g: number; b: number; a: number };
      hex: string;
    };
    mode: string;
  };
}
