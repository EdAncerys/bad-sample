// CONTEXT ------------------------------------------------------------------
import { setFetchAction, setEnquireAction, fetchDataHandler } from "../index";

export const sendEmailEnquireAction = async ({
  state,
  dispatch,
  formData,
  attachments,
  recipients,
  emailSubject,
  template,
}) => {
  // console.log("enquireAction triggered");

  setFetchAction({ dispatch, isFetching: true });
  const path = state.auth.APP_HOST + `/email`;

  try {
    if (!recipients) throw new Error("No Recipients Provided");

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

    const form = new FormData(); // create form object to sent email content & attachments
    form.append("template", template || "Placeholder"); // default email template
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

    const respose = await fetch(path, requestOptions);
    const data = await respose.json();
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
