// 📌 EVENTS

export const getEventsData = async ({ state, page, postsPerPage }) => {
  let pageNo = page || 1;
  let perPageLimit = postsPerPage || state.theme.perPageLimit;
  let fields =
    "title,link,event_grade,event_location,event_specialty,acf.date_time,acf.image,acf.preview_summary,acf.organizer,acf.venue";

  let url = `${state.auth.WP_HOST}wp-json/wp/v2/events?&per_page=${perPageLimit}&page=${pageNo}&_fields=${fields}&filter[orderby]=event_start_date&order=asc`;

  try {
    let data = [];

    let response = await fetch(url);
    // fetch events data from WP & while respone is not 400 (bad request) keep fetching
    while (response.status !== 400) {
      let json = await response.json();

      data = [...data, ...json];
      pageNo++;
      url = `${state.auth.WP_HOST}wp-json/wp/v2/events?&per_page=${perPageLimit}&page=${pageNo}&_fields=${fields}&filter[orderby]=event_start_date&order=asc`;
      response = await fetch(url);
    }

    return data;
  } catch (error) {
    console.log("🐞 ", error);
  }
};

export const getEventGrades = async ({ state }) => {
  const url = `${state.auth.WP_HOST}wp-json/wp/v2/event_grade?_fields=name,id`;

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

export const getEventLocations = async ({ state }) => {
  const url = `${state.auth.WP_HOST}wp-json/wp/v2/event_location?_fields=name,id`;

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

export const getEventSpecialtys = async ({ state }) => {
  const url = `${state.auth.WP_HOST}wp-json/wp/v2/event_specialty?_fields=name,id`;

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

// 📌 NEWS & MEDIA
export const getNewsData = async ({ state, page, postsPerPage }) => {
  let pageNo = page || 1;
  let perPageLimit = postsPerPage || state.theme.perPageLimit;
  let fields =
    "title,link,date,release,title,categories,featured_media,excerpt,yoast_head_json.og_image,acf";

  let url = `${state.auth.WP_HOST}wp-json/wp/v2/posts?&per_page=${perPageLimit}&page=${pageNo}&_fields=${fields}&order=asc`;

  try {
    let data = [];

    let response = await fetch(url);
    // fetch events data from WP & while respone is not 400 (bad request) keep fetching
    while (response.status !== 400) {
      let json = await response.json();

      data = [...data, ...json];
      pageNo++;
      url = `${state.auth.WP_HOST}wp-json/wp/v2/events?&per_page=${perPageLimit}&page=${pageNo}&_fields=title,link,event_grade,event_location,event_specialty,acf.date_time,acf.image,acf.preview_summary,acf.organizer,acf.venue&filter[orderby]=event_start_date&order=asc`;
      response = await fetch(url);
    }

    return data;
  } catch (error) {
    console.log("🐞 ", error);
  }
};

export const getMediaCategories = async ({ state }) => {
  const url = `${state.auth.WP_HOST}wp-json/wp/v2/categories?_fields=name,id`;

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

export const setMediaCategoriesAction = ({
  dispatch,
  newsMediaCategoryList,
}) => {
  // console.log("setFilterAction triggered"); //debug
  dispatch({ type: "SET_MEDIA_LIST_ACTION", payload: newsMediaCategoryList });
};
