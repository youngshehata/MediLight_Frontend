import classes from "./Homepage.module.css";

export default function LanguageOption({ imgUrl, text }) {
  return (
    <div className={`${classes.languageOption} flexCenterColumn`}>
      <div className={`${classes.languageImgWrapper} flexCenterRow`}>
        <img
          className={`${classes.languageImg}`}
          src={imgUrl}
          alt={`Language_${text}`}
        />
      </div>
      <span className={`${classes.languageText}`}>{text}</span>
    </div>
  );
}
