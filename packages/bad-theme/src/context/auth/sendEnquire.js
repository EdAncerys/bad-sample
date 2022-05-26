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
    console.log(recipients);
    let recipientsArray = [];
    recipients.map((item) => {
      recipientsArray.push(item.email);
    });
    const recipientsList = recipientsArray.toString();

    let fileAttachmentList = null;
    if (attachments) fileAttachmentList = Object.values(attachments); // add attachments to array

    let subject = "B.A.D Enquiry";
    if (emailSubject) subject = emailSubject;
    // append recipientsList to formData
    formData.recipientsList = recipientsList;
    formData.subject = subject;

    // ⬇️ Add defaults to formData if nothing been passed in | user data not available ⬇️
    formData.currentHospitalName = formData.currentHospitalName || "";
    formData.hospitalChangeName = formData.hospitalChangeName || "";
    formData.jobtitle = formData.jobtitle || "";
    formData.fullname = formData.fullname || "";
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
      formData.jobtitle = formData.fullname || isActiveUser.fullname;
      formData.jobtitle = formData.bad_memberid || isActiveUser.bad_memberid;
      formData.emailaddress1 =
        formData.emailaddress1 || isActiveUser.emailaddress1;
      formData.mobilephone = formData.mobilephone || isActiveUser.mobilephone;
    }

    const form = new FormData(); // create form object to sent email content & attachments
    form.append("template", template || "BADEnquiryForm"); // default email template
    form.append("email", recipientsList);
    form.append("data", JSON.stringify(formData));
    form.append("subject", subject);
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
    console.log("REQUEST", requestOptions);
    const respose = await fetch(path, requestOptions);
    console.log("RESPONSE", respose);
    const data = await respose.json();
    console.log("EMAIL DATA", data);
    if (data.success) {
      return data;
    } else {
      console.log("⬇️ Error sending email response"); // debug
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
    console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
    setEnquireAction({ dispatch, enquireAction: null });
  }
};
