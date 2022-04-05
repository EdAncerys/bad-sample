import { v4 as uuidv4 } from "uuid";
import { authenticateAppAction, setFetchAction } from "../index";

export const sendFileToS3Action = async ({
  state,
  dispatch,
  attachments,
  isPicture,
  refreshJWT,
}) => {
  console.log("sendFileToS3Action triggered");

  setFetchAction({ dispatch, isFetching: true });
  const URL = state.auth.APP_HOST + `/s3/profile/image`;
  const jwt = await authenticateAppAction({ state, dispatch, refreshJWT });

  // extract file extension name from attachment
  const fileExtension = attachments.name.split(".").pop();
  const uniqueName = uuidv4();
  let fileName = uniqueName + "." + fileExtension;
  if (isPicture) fileName = uniqueName;

  const form = new FormData(); // create form object to sent email content & attachments
  form.append("profile", attachments, fileName); // append file to form object

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
