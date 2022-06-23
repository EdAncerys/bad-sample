import { connect } from "frontity";
import Image from "@frontity/components/image";

import date from "date-and-time";
const DATE_MODULE = date;

import Bulletins from "../../img/svg/bulletins.svg";
import eCircular from "../../img/svg/eCircular.svg";
import Insights from "../../img/svg/insights.svg";
import Podcasts from "../../img/svg/podcasts.svg";
import PressRelease from "../../img/svg/pressRelease.svg";
import Responses from "../../img/svg/responses.svg";
import Updates from "../../img/svg/updates.svg";
// CONTEXT --------------------------------------------------------
import { Parcer } from "../../context";

const NewsAndMediaHeader = ({
  state,
  actions,
  libraries,
  newsAndMediaInfo,
  categoryList,
  layout,
}) => {
  if (!newsAndMediaInfo) return null;

  const { categories, excerpt, title, date, featured_media, yoast_head_json } =
    newsAndMediaInfo;

  const isLayoutTwo = layout === "layout_two";
  const isLayoutThree = layout === "layout_three";
  const isLayoutFour = layout === "layout_four";
  const isLayoutFive = layout === "layout_five";

  // SERVERS ---------------------------------------------
  const ServeTitle = () => {
    if (!title) return null;

    return (
      <div
        className="primary-title body-limit"
        style={{ fontSize: 20, WebkitLineClamp: 6 }}
      >
        <Parcer libraries={libraries} html={title.rendered} />
      </div>
    );
  };

  const ServeIcon = () => {
    if (isLayoutTwo) return null;
    const alt = title.rendered || "BAD";

    let postCat = "Uncategorized";
    if (categoryList && categories) {
      const filter = categoryList.filter(
        (item) => item.id === Number(categories[0])
      );
      postCat = filter[0].name;
    }

    const ICON_WIDTH = 40;
    let SERVE_ICON = PressRelease;
    if (postCat === "Uncategorized" || postCat === "Presidential Bulletin")
      SERVE_ICON = Bulletins;
    if (postCat === "Official Response") SERVE_ICON = Responses;
    if (postCat === "Podcast") SERVE_ICON = Podcasts;
    if (postCat === "E-Circular") SERVE_ICON = eCircular;
    if (postCat === "Insights") SERVE_ICON = Insights;
    if (postCat === "News &amp; Updates") SERVE_ICON = Updates;

    return (
      <div
        style={{
          width: ICON_WIDTH,
          height: ICON_WIDTH,
        }}
      >
        <Image
          src={SERVE_ICON}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    );
  };

  const ServeImage = () => {
    if (!featured_media) return null;

    let media = null;
    if (yoast_head_json) media = yoast_head_json.og_image[0].url;
    const alt = title.rendered || "BAD";

    if (!media) return null;

    return (
      <div
        style={{
          width: "100%",
          height: 300,
        }}
      >
        <Image
          src={media}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          className="card-image-animated"
        />
      </div>
    );
  };

  const ServeCategory = () => {
    if (!categoryList || !categories) return null;

    const filter = categoryList.filter(
      (item) => item.id === Number(categories[0])
    );
    let categoryName = filter[0].name;
    // 📌 replace names with singular form
    if (categoryName === "E-Circulars") categoryName = "E-Circular";
    if (categoryName === "Insights") categoryName = "Insight";
    if (categoryName === "News &amp; Updates") categoryName = "News Update";
    if (categoryName === "Newsletters") categoryName = "Newsletter";
    if (categoryName === "Official Responses")
      categoryName = "Official Response";
    if (categoryName === "Podcasts") categoryName = "Podcast";
    if (categoryName === "President's Bulletins")
      categoryName = "President's Bulletin";
    if (categoryName === "Press Releases") categoryName = "Press Release";

    return (
      <div className="primary-title" style={{ fontSize: 20, paddingRight: 10 }}>
        <Parcer libraries={libraries} html={categoryName} />
      </div>
    );
  };

  const ServeDate = () => {
    if (!date) return null;

    const dateObject = new Date(date);
    const formattedDate = DATE_MODULE.format(dateObject, "DD MMM YYYY");

    return (
      <div style={{ padding: `1em 0` }}>
        <Parcer libraries={libraries} html={formattedDate} />
      </div>
    );
  };

  const ServeBody = () => {
    if (!excerpt) return null;

    return (
      <div style={{ padding: `0.5em 0 0` }}>
        <Parcer libraries={libraries} html={excerpt.rendered} />
      </div>
    );
  };

  const ServeLayoutTwo = () => {
    if (!isLayoutTwo) return null;

    return (
      <div id="layout-two">
        <ServeImage />
        <div style={{ padding: `1em 1.5em 0` }}>
          <ServeCategory />
          <ServeDate />
          <ServeBody />
        </div>
      </div>
    );
  };

  const ServeLayoutThree = () => {
    if (!isLayoutThree && !isLayoutFive) return null;

    return (
      <div style={{ padding: `1em 1.5em 0` }} id="layout-three">
        <div style={{ paddingBottom: `1em` }}>
          <div className="flex">
            <div className="flex-col">
              <ServeCategory />
              <ServeDate />
            </div>
            <ServeIcon />
          </div>
        </div>
        <ServeTitle />
      </div>
    );
  };

  const ServeLayoutFour = () => {
    if (!isLayoutFour) return null;

    return (
      <div style={{ padding: `2em 3em 0` }} id="layour-four">
        <ServeTitle />
        <ServeDate />
        <ServeBody />
      </div>
    );
  };

  return (
    <div className="flex-col">
      <ServeLayoutTwo />
      <ServeLayoutThree />
      <ServeLayoutFour />
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(NewsAndMediaHeader);
