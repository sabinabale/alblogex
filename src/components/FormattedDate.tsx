type FormattedDateProps = {
  date: string;
};

function FormattedDate({ date }: FormattedDateProps) {
  const formattedDate = new Date(date)
    .toLocaleDateString("cs-CZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\s*\.\s*/g, ".");

  return <time dateTime={date}>{formattedDate}</time>;
}

export default FormattedDate;
