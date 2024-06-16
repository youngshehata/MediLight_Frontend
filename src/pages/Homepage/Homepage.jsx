import Footer from "../../components/Footer/Footer";
import classes from "./Homepage.module.css";
import LanguageOption from "./LanguageOption";

export default function Homepage({ changeLanguage }) {
  return (
    <main className={`${classes.homepageContainer} flexCenterColumn`}>
      <section className={`${classes.loginSection}`}>
        <div className={`${classes.languagesContainer}`}>
          <LanguageOption imgUrl={"/ukFlag.svg"} text={"English"} />
          <LanguageOption imgUrl={"/egyptFlag.svg"} text={"عربى"} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
