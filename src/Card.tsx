import * as React from "react";

interface ICardProps {
  children: {};
}

export default (props: ICardProps) => (
  <div
    style={{
      alignItems: "flex-start",
      color: "black",
      background: "white",
      borderRadius: "4px",
      boxShadow:
        "rgba(0, 0, 0, 0.15) 0px 0px 0px 1px, rgba(0, 0, 0, 0.15) 0px 8px 16px",
      boxSizing: "initial",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      marginTop: "16px",
      padding: "10px",
      width: "200px",
      fontSize: "16px"
    }}
  >
    {props.children}
  </div>
);
