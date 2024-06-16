import Footer from "../../components/Footer/Footer";
import LoginForm from "../../components/LoginForm/LoginForm";
import classes from "./Homepage.module.css";
import LanguageOption from "./LanguageOption";

export default function Homepage({ changeLanguage }) {
  return (
    <main className={`${classes.homepageContainer} flexCenterColumn`}>
      <section className={`${classes.loginSection}`}>
        <div className={`${classes.languagesContainer} gridAllColumns`}>
          <LanguageOption
            imgUrl={"/ukFlag.svg"}
            text={"English"}
            changeLanguageFunction={() => {
              changeLanguage("en");
            }}
          />
          <LanguageOption
            imgUrl={"/egyptFlag.svg"}
            text={"عربى"}
            changeLanguageFunction={() => {
              changeLanguage("ar");
            }}
          />
        </div>
        <div className={`${classes.illustrationContainer} flexCenterRow`}>
          <img
            className={`${classes.illustration}`}
            src="/home_doctors_illust.svg"
            alt="dctors"
          />
        </div>
        <LoginForm />
        <div className="flexCenterRow gridAllColumns">
          <img className={`${classes.appLogo}`} src="/appLogo.svg" alt="Logo" />
        </div>
      </section>
      <Footer />
    </main>
  );
}
