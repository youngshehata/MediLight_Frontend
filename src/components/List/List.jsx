import React from "react";
import classes from "./List.module.css";

// This component represet lists like:  Messages & Notifications
//  const List =  React.forwardRef(function List(
//   { listName, count, viewAllLabel, notFoundLabel, items },
//   ref
const List = ({ listName, count, viewAllLabel, notFoundLabel, items }, ref) => {
  return (
    <div ref={ref} className={`${classes.listContainer}`}>
      <p className={`${classes.title} flexCenterRow`}>
        {listName}
        {` (`}
        <span>{count ? count : items?.length}</span>
        {`)`}
      </p>
      <ul
        className={
          items
            ? `${classes.ul} scroll`
            : `${classes.ul} ${classes.ulNotFound} scroll`
        }
      >
        {items ? (
          items.map((item) => {
            return item; // that means items gonna be array of components not objects
          })
        ) : (
          <span className={`${classes.notFound}`}>{notFoundLabel}</span>
        )}
      </ul>
      <span className={`${classes.viewAllLabel} flexCenterRow`}>
        {viewAllLabel}
      </span>
    </div>
  );
};
export default React.forwardRef(List);
