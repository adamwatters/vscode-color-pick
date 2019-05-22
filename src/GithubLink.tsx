import * as React from "react";
import Octocat from "./images/GithubIcon";

interface IGithubLinkProps {
  link: string;
}

export default (props: IGithubLinkProps) => {
  const boxHeight = "120px";
  return (
    <div
      style={
        {
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: `0 ${boxHeight} ${boxHeight} 0`,
          borderColor: "transparent #000 transparent transparent",
          position: "absolute",
          top: 0,
          right: 0
        }
      }
    >
      <div
        style={
          {
            position: "relative",
            top: 0,
            right: 0,
            height: boxHeight,
            width: boxHeight
          }
        }
      >
        <a href={props.link}>
          <Octocat repoLink={props.link}/>
        </a>
      </div>
    </div>
  );
}
