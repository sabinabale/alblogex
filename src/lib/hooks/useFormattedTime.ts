import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

export const useFormattedTime = () => {
  const formatTime = (timestamp: string) => {
    try {
      const localDate = dayjs.utc(timestamp).tz(dayjs.tz.guess());
      return localDate.fromNow();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "a few seconds ago";
    }
  };

  return { formatTime };
};
