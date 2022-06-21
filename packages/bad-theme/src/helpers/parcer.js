export const Parcer = ({ libraries, html }) => {
  // --------------------------------------------------------------------------------
  // 📌  Html parser handler
  // --------------------------------------------------------------------------------
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  // 📌  Check if html is a string. If not, return error.
  if (typeof html !== "string") {
    // if html is null | undefined | false, return null
    if (!html) {
      html = `Parcer error: html is underfined | null.`;
    } else {
      html = `Parcer error: html is an ${typeof html} type.`;
    }
  }

  // 📌  Return the parsed html
  return <Html2React html={html} />;
};
