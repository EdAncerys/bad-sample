// CONTEXT ------------------------------------------------------------------
import { setFetchAction, setEnquireAction } from "../index";

export const sendEmailEnquireAction = async ({
  state,
  dispatch,
  formData,
  attachments,
  recipients,
  emailSubject,
  template,
  isActiveUser,
}) => {
  // console.log("enquireAction triggered");
  setFetchAction({ dispatch, isFetching: true });
  const path = state.auth.APP_HOST + `/email`;

  try {
    if (!recipients) throw new Error("No Recipients Provided");
    let recipientsArray = [];
    recipients.map((item) => {
      recipientsArray.push(item.email);

      return null;
    });
    const recipientsList = recipientsArray.toString();

    let fileAttachmentList = null;
    if (attachments) fileAttachmentList = Object.values(attachments); // add attachments to array

    // --------------------------------------------------------------------------------
    // 📌  Form defaults
    // --------------------------------------------------------------------------------
    let formTitle = "B.A.D Enquiry";
    if (emailSubject) formTitle = emailSubject;
    let formTemplate = template || "BADEnquiryForm";
    // append recipientsList to formData
    formData.recipientsList = recipientsList;
    formData.form_title = formTitle;

    // ⬇️ Add defaults to formData if nothing been passed in | user data not available ⬇️
    formData.currentHospitalName = formData.currentHospitalName || "";
    formData.hospitalChangeName = formData.hospitalChangeName || "";

    formData.jobtitle = formData.jobtitle || "";

    formData.fullname = formData.fullname || "";
    formData.subject = formData.subject || "";
    formData.bad_memberid = formData.bad_memberid || "";
    formData.emailaddress1 = formData.emailaddress1 || "";
    formData.mobilephone = formData.mobilephone || "";
    formData.subject_dropdown_options = formData.subject_dropdown_options || "";
    formData.message = formData.message || "";

    if (isActiveUser) {
      // 📌 pass in defaults user values from Dynamics if not provided
      formData.currentHospitalName =
        formData.currentHospitalName ||
        isActiveUser[
          "_parentcustomerid_value@OData.Community.Display.V1.FormattedValue"
        ];
      formData.jobtitle = formData.jobtitle || isActiveUser.jobtitle;
      formData.fullname = formData.fullname || isActiveUser.fullname;
      formData.bad_memberid =
        formData.bad_memberid || isActiveUser.bad_memberid;
      formData.emailaddress1 =
        formData.emailaddress1 || isActiveUser.emailaddress1;
      formData.mobilephone = formData.mobilephone || isActiveUser.mobilephone;

      if (!template) formTemplate = "BADEnquiryFormAuth"; // switch template to include data from Dynamics
    }

    const form = new FormData(); // create form object to sent email content & attachments
    form.append("template", formTemplate); // default email template
    form.append("email", recipientsList);
    form.append("data", JSON.stringify(formData));
    form.append("subject", formTitle);
    // map files if attachments are provided Only for email template
    if (fileAttachmentList)
      fileAttachmentList.map((file) => {
        form.append("attachments", file, file.name);
      });

    const requestOptions = {
      method: "POST",
      body: form,
      credentials: "include",
    };
    const response = await fetch(path, requestOptions);
    const data = await response.json();
    // console.log("🐞 ", data);

    if (data.success) {
      return data;
    } else {
      // console.log("⬇️ Error sending email response"); // debug
      throw new Error(data.message);
    }

    // const data = await fetchDataHandler({
    //   path,
    //   method: "POST",
    //   body: form,
    //   state,
    //   // 📌 pass headers as multipart/form-data
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // });
    // const response = await data.json();

    // if (response.success) {
    //   return response;
    // } else {
    //   console.log("⬇️ Error sending email response"); // debug
    //   console.log(response); // debug
    // }
  } catch (error) {
    // console.log("error sending enquiry", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
    setEnquireAction({ dispatch, enquireAction: null });
  }
};
