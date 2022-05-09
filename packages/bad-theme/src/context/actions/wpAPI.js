export const getEventsData = async ({ state, page }) => {
  let pageNo = page || 1;
  const url = `${state.auth.WP_HOST}wp-json/wp/v2/events?&per_page=2&page=${pageNo}&_fields=title,link,event_grade,event_location,event_specialty,acf.date_time,acf.image,acf.summary,acf.organizer,acf.venue&filter[orderby]=event_start_date&order=asc`;
  // ⬇️ fetch data via wp API page by page

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Fetching error");

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("🐞 ", error);
  }
};
