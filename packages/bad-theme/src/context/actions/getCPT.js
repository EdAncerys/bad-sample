export const getPILsDataAction = async ({ state, actions }) => {
  console.log("getPILsDataAction triggered"); //debug
  const path = `/pils/`;
  await actions.source.fetch(path); // fetch CPT data
  const data = state.source.get(path);
  const { totalPages, page, next } = data; // check if data have multiple pages

  // ⬇️ fetch data via wp API page by page
  let isThereNextPage = next;
  while (isThereNextPage) {
    await actions.source.fetch(isThereNextPage); // fetch next page
    const nextPage = state.source.get(isThereNextPage).next; // check ifNext page & set next page
    isThereNextPage = nextPage;
  }
};

export const getGuidelinesDataAction = async ({ state, actions }) => {
  console.log("getGuidelinesDataAction triggered"); //debug
  const path = `/guidelines_standards/`;
  await actions.source.fetch(path); // fetch CPT data
  const data = state.source.get(path);
  const { totalPages, page, next } = data; // check if data have multiple pages

  // ⬇️ fetch data via wp API page by page
  let isThereNextPage = next;
  while (isThereNextPage) {
    await actions.source.fetch(isThereNextPage); // fetch next page
    const nextPage = state.source.get(isThereNextPage).next; // check ifNext page & set next page
    isThereNextPage = nextPage;
  }
};
