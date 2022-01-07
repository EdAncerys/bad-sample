import {
  authenticateAppAction,
  setFetchAction,
  setEnquireAction,
} from "../index";

export const sendEmailEnquireAction = async ({
  state,
  dispatch,
  formData,
  attachments,
  recipients,
}) => {
  console.log("enquireAction triggered");

  setFetchAction({ dispatch, isFetching: true });
  const URL = state.auth.APP_HOST + `/email`;
  const jwt = await authenticateAppAction({ state });

  let recipientsArray = [];
  console.log(recipients);
  if (!!recipients.length) {
    recipients.map((item) => {
      recipientsArray.push(item.email);
    });
  }
  const recipientsList = recipientsArray.toString();

  let fileAttachmentList = [];
  if (attachments) fileAttachmentList = Object.values(attachments); // add attachments to array

  const form = new FormData(); // create form object to sent email content & attachments
  form.append("email", recipientsList);
  form.append("template", "SampleEmailTemplate");
  form.append("data", `${formData}`);
  fileAttachmentList.map((file) => {
    form.append("attachments", file, file.name);
  });

  const requestOptions = {
    method: "POST",
    headers: { Authorization: `Bearer ${jwt}` },
    body: form,
  };

  try {
    const data = await fetch(URL, requestOptions);
    const response = await data.json();
    console.log(response);
    setFetchAction({ dispatch, isFetching: null });
    setEnquireAction({ dispatch, enquireAction: null });
  } catch (error) {
    console.log("error", error);
    setFetchAction({ dispatch, isFetching: null });
  }
};
