export const anchorScrapper = () => {
  const links = document.querySelectorAll("a"); // get all links in document object

  if (!links.length) return;
  Object.values(links).map((link) => {
    const anchor = link.href;
    const isAnchor = "http://3.9.193.188";
    const anchorReplacer = link.href.split(isAnchor)[1];

    if (anchor.includes(isAnchor)) {
      console.log("🔗 anchor replaced");
      link.href = anchorReplacer;
    }
  });
};
