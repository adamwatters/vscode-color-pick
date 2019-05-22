import * as React from "react";
import Octocat from "./images/GithubIcon";

interface IGithubLinkProps {
  link: string;
}

export default (props: IGithubLinkProps) => {
  return (
    <div
      style={
        {
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "0 120px 120px 0",
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
            top: "22px",
            left: "65px",
            height: "31.77px",
            width: "32.58px"
          }
        }
      >
        <a style={
          {
            borderStyle: "none",
            outline: "none"
          }
        }
        href={props.link}>
          <Octocat repoLink={props.link}/>
        </a>
      </div>
    </div>
  );
}
