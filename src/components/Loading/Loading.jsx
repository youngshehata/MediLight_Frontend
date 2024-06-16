import React from "react";
import classes from "./Loading.module.css";

export default function Loading() {
  return (
    <div className={`${classes.loadingContainer} flexCenterRow`}>
      <span className={`${classes.loader}`}></span>
      <span className={`${classes.loader2}`}></span>
    </div>
  );
}
