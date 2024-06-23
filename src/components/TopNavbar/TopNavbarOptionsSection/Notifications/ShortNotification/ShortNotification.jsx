import classes from "../Notifications.module.css";

export default function ShortNotification({ title, date, details }) {
  return (
    <div className={`${classes.shortNotificationContainer} flexCenterColumn`}>
      <div className={`${classes.titleAndDateDiv}`}>
        <span className={`${classes.NotificationTitle}`}>{title}</span>
        <span className={`${classes.NotificationDate}`}>{date.toString()}</span>
      </div>
      <div className={`${classes.NotificationDetails} scroll`}>{details}</div>
    </div>
  );
}
