export const getMembershipDataAction = async ({ state, actions }) => {
  const path = `/memberships/`;
  await actions.source.fetch(path); // fetch membership application data
  const memberships = state.source.get(path);
  const { totalPages, page, next } = memberships; // check if memberships have multiple pages
  // fetch memberships via wp API page by page
  let isThereNextPage = next;
  while (isThereNextPage) {
    await actions.source.fetch(isThereNextPage); // fetch next page
    const nextPage = state.source.get(isThereNextPage).next; // check ifNext page & set next page
    isThereNextPage = nextPage;
  }
};
