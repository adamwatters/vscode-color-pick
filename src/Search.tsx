// tslint:disable:no-console
import convert from "color-convert";
import namedColors from "color-name-list";
import Fuse from "fuse.js";
import { debounce } from "lodash";
import React, { useState } from "react";
import { ColorResult } from "react-color";

const fuse = new Fuse(namedColors, {
  shouldSort: true,
  threshold: 0.2,
  location: 0,
  distance: 100,
  maxPatternLength: 16,
  minMatchCharLength: 1,
  keys: ["name"]
});

interface IProps {
  hex: string;
  name: string;
  onSelect: (hex: string) => void;
}

const Color = (props: IProps) => {
  const [focus, setFocus] = useState(false);
  const onFocus = () => {
    setFocus(true);
  };
  const onBlur = () => {
    setFocus(false);
  };
  const onClick = () => {
    props.onSelect(props.hex);
  };
  const onKeyDown = (e: { key: string }) => {
    if (e.key === "Enter") {
      props.onSelect(props.hex);
    }
  };
  return (
    <div
      tabIndex={0}
      key={props.hex}
      style={{
        backgroundColor: props.hex,
        fontSize: 16,
        textShadow: "grey 1px 0 10px",
        height: focus ? 40 : 30,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "height .2s",
        cursor: "pointer"
      }}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      {props.name}
    </div>
  );
};

interface IVscode {
  postMessage: (message: object) => void;
}

interface ISearchProps {
  search: string;
  setSearch: (s: string) => void;
  searchSelect: (color: ColorResult) => void;
  vscode: IVscode;
}

const dispatchSearchEvent = (vscode: IVscode, searchString: string) => {
  if (searchString !== "") {
    vscode.postMessage({
      searchString,
      command: "search"
    });
  }
};

const debouncedSearchEvent = debounce(dispatchSearchEvent, 500);

const Search = (props: ISearchProps) => {
  const { search, setSearch, searchSelect, vscode } = props;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    debouncedSearchEvent(vscode, value);
    setSearch(value);
  };

  const colors = fuse.search(search).slice(0, 30);

  const selectColor = (hex: string) => {
    const [r, g, b] = convert.hex.rgb(hex);
    const [h, s, l] = convert.hex.hsl(hex);
    searchSelect({
      hex,
      rgb: { r, g, b, a: 1 },
      hsl: { h, s, l }
    });
    setSearch("");
  };

  return (
    <div className="App">
      <input
        style={{ width: 300, height: 30, fontSize: 22 }}
        type="text"
        onChange={handleSearchChange}
        value={search}
        autoFocus={true}
        placeholder="Search 18,000+ Color Names"
      />
      <div>
        {colors.map((color: any) => (
          <Color onSelect={selectColor} {...color} />
        ))}
      </div>
    </div>
  );
};

export default Search;
