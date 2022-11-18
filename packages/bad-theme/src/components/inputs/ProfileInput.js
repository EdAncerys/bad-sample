import { connect } from "frontity";
import Image from "@frontity/components/image";
// --------------------------------------------------------------------------------
import { FORM_CONFIG, colors } from "../../config/form";
import ErrorComponent from "./ErrorComponent";
import Avatar from "../../img/svg/profile.svg";

const ProfileInput = ({
  form,
  name,
  profilePictureRef, // reference to file url for input
  labelClass,
  Label,
  handleDocUploadChange,
}) => {
  return (
    <div style={{ order: FORM_CONFIG?.[name]?.order, position: "relative" }}>
      <ErrorComponent name={name ?? ""} form={form} />

      <div
        style={{
          width: 260,
          height: 260,
          borderRadius: "50%",
          overflow: "hidden",
          // add border if image set by user
          border: form?.sky_profilepicture
            ? `1px solid ${colors.silver}`
            : "none",
          marginBottom: "2rem",
        }}
      >
        <Image
          src={form?.sky_profilepicture || Avatar}
          alt="Profile Avatar"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <label className={labelClass}>{Label}</label>
      <div style={{ position: "relative", height: 40, overflow: "hidden" }}>
        <label
          style={{
            position: "absolute",
            left: 120,
            height: 40,
            display: "flex",
            alignItems: "center",
            zIndex: 1,
            fontSize: 8,
          }}
          className="caps-btn-no-underline"
        >
          {form?.dev_new_doc ?? "Profile picture exists in database"}
        </label>

        <input
          ref={profilePictureRef}
          name={name}
          onChange={handleDocUploadChange}
          type="file"
          className="form-control input"
          placeholder="Profile Photo"
          accept="image/png, image/jpeg"
          style={{
            color: "transparent",
            background: "transparent",
            position: "absolute",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
};

export default connect(ProfileInput);
