import { connect } from "frontity";
import Image from "@frontity/components/image";
import Avatar from "../../img/svg/profile.svg";

// CONTEXT ----------------------------------------------------------------
import { useAppState, muiQuery } from "../../context";

const ProfileAvatar = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const { sm, md, lg, xl } = muiQuery();
  const { isActiveUser } = useAppState();

  if (!isActiveUser) return null;

  const { bad_listname, bad_profile_photo_url } = isActiveUser;
  const alt = bad_listname || "Profile Picture";
  let imgWidth = 350;
  if (xl) {
    imgWidth = 200;
  } else {
    imgWidth = 350;
  }

  return (
    <div className="flex" style={{ justifyContent: "flex-end" }}>
      <div
        style={{
          width: imgWidth,
          height: imgWidth,
          borderRadius: `50%`,
          overflow: `hidden`,
          margin: "3em 0 0 0",
        }}
      >
        <Image
          src={bad_profile_photo_url || Avatar}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(ProfileAvatar);
