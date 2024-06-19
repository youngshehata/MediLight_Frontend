import classes from "./SideNavbar.module.css";

export default function SideNavbar({ sidebarClass }) {
  return <div className={`${classes.navbar} ${sidebarClass}`}>Side</div>;
}
