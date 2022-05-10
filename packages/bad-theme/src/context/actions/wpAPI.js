export const getEventsData = async ({ state, page, postsPerPage }) => {
  let pageNo = page || 1;
  let perPageLimit = postsPerPage || state.theme.perPageLimit;

  const url = `${state.auth.WP_HOST}wp-json/wp/v2/events?&per_page=${perPageLimit}&page=${pageNo}&_fields=title,link,event_grade,event_location,event_specialty,acf.date_time,acf.image,acf.preview_summary,acf.organizer,acf.venue&filter[orderby]=event_start_date&order=asc`;

  try {
    // ⬇️ fetch data via wp API page by page
    const response = await fetch(url);
    if (!response.ok) throw new Error("Fetching error");

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("🐞 ", error);
  }
};
