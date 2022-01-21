import { authenticateAppAction, setFetchAction } from "../index";

export const sendFileToS3Action = async ({ state, dispatch, attachments }) => {
  console.log("sendFileToS3Action triggered");

  setFetchAction({ dispatch, isFetching: true });
  const URL = `state.auth.APP_HOST` + `/email`;
  const jwt = await authenticateAppAction({ state });

  let fileAttachmentList = [];
  if (attachments) fileAttachmentList = Object.values(attachments); // add attachments to array

  const form = new FormData(); // create form object to sent email content & attachments

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
    console.log("response", response);

    if (response.success) {
      return response;
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};
