import { v4 as uuidv4 } from "uuid";
import { setFetchAction, fetchDataHandler } from "../index";

export const sendFileToS3Action = async ({ state, dispatch, attachments }) => {
  // console.log("sendFileToS3Action triggered");

  setFetchAction({ dispatch, isFetching: true });
  const path = state.auth.APP_HOST + `/s3/profile/image`;

  // extract file extension name from attachment
  const fileExtension = attachments.name.split(".").pop();
  const uniqueName = uuidv4();
  let fileName = uniqueName + "." + fileExtension;
  // if (isNoFileExtention) fileName = uniqueName; // 📌 dont add extension to picture files

  const form = new FormData(); // create form object to sent email content & attachments
  form.append("profile", attachments, fileName); // append file to form object

  try {
    const data = await fetchDataHandler({
      path,
      method: "PUT",
      body: form,
      state,
    });

    const response = await data.json();
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    // console.log("error", error);
  } finally {
    setFetchAction({ dispatch, isFetching: false });
  }
};
