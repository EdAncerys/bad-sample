export const handleSortFilter = ({ list }) => {
  let sortedList = list;

  // 📌 uncoment to sort by data
  // 📌 sort events by date newest first
  sortedList.sort((a, b) => {
    let dateA = a.acf.date_time;
    let dateB = b.acf.date_time;
    if (dateA) dateA = dateA[0].date;
    if (dateB) dateB = dateB[0].date;
    // convert to date object
    dateA = new Date(dateA);
    dateB = new Date(dateB);

    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    return 0;
  });

  // 📌 sort eventList by closest to today first (if date is set)
  sortedList.sort((a, b) => {
    let dateA = a.acf.date_time;
    let dateB = b.acf.date_time;
    if (dateA) dateA = dateA[0].date;
    if (dateB) dateB = dateB[0].date;

    // convert to date object
    dateA = new Date(dateA);
    dateB = new Date(dateB);

    // get today's date
    let today = new Date();

    // get date difference
    let diffA = Math.abs(dateA - today);
    let diffB = Math.abs(dateB - today);

    if (diffA > diffB) return 1;
    if (diffA < diffB) return -1;

    return 0;
  });

  return sortedList;
};
