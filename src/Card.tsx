import React from "react";

interface CardProps {
  children: React.ReactNode;
}

const Card = (props: CardProps) => (
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
      fontSize: "16px",
    }}
  >
    {props.children}
  </div>
);

export default Card;
