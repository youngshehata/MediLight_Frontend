export const formatTimeEn = function (date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + ampm;
  return strTime;
};

export const formatTimeAr = function (date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "م" : "ص";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  // var strTime = hours + ":" + minutes + " " + ampm;
  // var strTime = `(${ampm})${hours}:${minutes}`;
  var strTime = `${hours}:${minutes}(${ampm})`;

  return strTime;
};

export const convertDate = (date) => {
  return `${date.getDate()} / ${
    date.getMonth() + 1
  } /   ${date.getFullYear()} `;
};
