import convert from "color-convert";
import colornames from "color-name-list/dist/colornames.esm.mjs";
import Fuse from "fuse.js";
import React, { useState } from "react";
import { ColorResult } from "react-color";

const fuse = new Fuse(colornames, {
  shouldSort: true,
  threshold: 0.2,
  distance: 100,
  minMatchCharLength: 1,
  keys: ["name"],
});

interface ColorProps {
  hex: string;
  name: string;
  onSelect: (hex: string) => void;
}

const Color = (props: ColorProps) => {
  const [focus, setFocus] = useState(false);
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
        cursor: "pointer",
      }}
      onClick={() => props.onSelect(props.hex)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter") props.onSelect(props.hex);
      }}
    >
      {props.name}
    </div>
  );
};

interface SearchProps {
  search: string;
  setSearch: (s: string) => void;
  searchSelect: (color: ColorResult) => void;
}

const Search = (props: SearchProps) => {
  const { search, setSearch, searchSelect } = props;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const colors = fuse.search(search, { limit: 30 }).map((r) => r.item);

  const selectColor = (hex: string) => {
    const [r, g, b] = convert.hex.rgb(hex);
    const [h, s, l] = convert.hex.hsl(hex);
    searchSelect({
      hex,
      rgb: { r, g, b, a: 1 },
      hsl: { h, s, l },
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
        {colors.map((color) => (
          <Color key={color.hex} onSelect={selectColor} {...color} />
        ))}
      </div>
    </div>
  );
};

export default Search;
