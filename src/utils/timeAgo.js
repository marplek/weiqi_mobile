export const timeAgo = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diff = now - past;

  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  if (diff < hour) {
    return `${Math.floor(diff / minute)} 分鐘前`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)} 小時前`;
  } else if (diff < day * 10) {
    return `${Math.floor(diff / day)} 天前`;
  } else if (diff < year) {
    return `${past.getMonth() + 1}月${past.getDate()}日`;
  } else {
    return `${past.getFullYear()}年${past.getMonth() + 1}月${past.getDate()}日`;
  }
};
