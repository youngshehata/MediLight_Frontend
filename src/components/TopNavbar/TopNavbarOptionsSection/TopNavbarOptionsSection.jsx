import DropDown from "../../DropDown";
import classes from "../TopNavbar.module.css";
import ProfileSection from "./ProfileSection/ProfileSection";

export default function TopNavbarOptionsSection() {
  return (
    <div className={`${classes.optionsSection} flexCenterRow`}>
      <ProfileSection />
    </div>
  );
}
