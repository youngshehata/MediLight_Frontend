import classes from "../Messages.module.css";

export default function ShortMessage({
  img,
  name,
  date,
  title,
  type, // for that RE
  details,
}) {
  return (
    <div className={`${classes.shortMessageContainer}`}>
      <img className={`${classes.messageImg}`} src={img} alt="sender" />
      <span className={`${classes.messageName}`}>{name}</span>
      <span className={`${classes.messageDate}`}>{date.toString()}</span>
      <span className={`${classes.messageTitle}`}>RE: {title}</span>
      <div className={`${classes.messageDetails} scroll`}>{details}</div>
    </div>
  );
}
