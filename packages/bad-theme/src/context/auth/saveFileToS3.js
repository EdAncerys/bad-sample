import { authenticateAppAction, setFetchAction } from "../index";

export const sendFileToS3Action = async ({ state, dispatch, attachments }) => {
  console.log("sendFileToS3Action triggered");

  setFetchAction({ dispatch, isFetching: true });
  const URL = state.auth.APP_HOST + `/s3/profile/image`;
  const jwt = await authenticateAppAction({ state });

  const form = new FormData(); // create form object to sent email content & attachments
  form.append("profile", attachments, attachments.name);

  const requestOptions = {
    method: "PUT",
    headers: { Authorization: `Bearer ${jwt}` },
    body: form,
  };

  try {
    const data = await fetch(URL, requestOptions);
    const response = await data.json();
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};
