import { connect, Head } from "frontity";
import Favicon from "../../img/svg/badFavicon.svg";

const HTMLHead = ({ meta }) => {
  let title = meta?.title || "British Association of Dermatologists";
  let description =
    meta?.description ||
    "Professional membership body for dermatologists in the UK and abroad.";
  let og_type = meta?.og_type || "BAD website";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={og_type} />
      <html lang="en" />
      <link rel="shortcut icon" href={Favicon}></link>
    </Head>
  );
};

export default connect(HTMLHead);
