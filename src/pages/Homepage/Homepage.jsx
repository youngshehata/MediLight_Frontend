import classes from "./Homepage.module.css";

export default function Homepage() {
  return (
    <main className={`${classes.homepageContainer} flexCenterRow`}>
      <section className={`${classes.loginSection}`}></section>
    </main>
  );
}
