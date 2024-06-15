import toast from "react-hot-toast";
import Footer from "../../components/Footer/Footer";
import classes from "./Homepage.module.css";

export default function Homepage({ changeLanguage }) {
  return (
    <main className={`${classes.homepageContainer} flexCenterColumn`}>
      <section
        onClick={changeLanguage()}
        className={`${classes.loginSection}`}
      ></section>
      <Footer />
    </main>
  );
}
