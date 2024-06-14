import Footer from "../../common/Footer/Footer";
import classes from "./Homepage.module.css";

export default function Homepage() {
  return (
    <main className={`${classes.homepageContainer} flexCenterColumn`}>
      <section className={`${classes.loginSection}`}></section>
      <Footer />
    </main>
  );
}
