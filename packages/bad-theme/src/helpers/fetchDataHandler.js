import { authenticateAppAction } from "../context";

export const fetchDataHandler = async ({
  method,
  path,
  accept,
  body,
  state,
}) => {
  // -----------------------------------------------
  // 📌 CUSTOM FETCH HANDLER
  // -----------------------------------------------

  method = method || "GET";
  accept = accept || "application/json";

  let jwt = null;
  if (state) jwt = await authenticateAppAction({ state });

  // 📌 HEADER  Options
  let headers = {
    "Content-Type": "application/json",
    Accept: accept,
    Authorization: `Bearer ${jwt}`,
    // set cash control headers to 7 days if method is GET
    ...(method === "GET" ? { "Cache-Control": "s-maxage=86400" } : {}),
  };

  // 📌 Options
  let requestOptions = {
    method,
    headers,
  };

  // 📌 BODY Options
  if (method !== "GET") {
    requestOptions = {
      ...requestOptions,
      body: JSON.stringify(body),
    };
  }

  try {
    if (!path) throw new Error("No path provided");
    // 📌 make a fetch request to the backend api with the given path
    const response = await fetch(path, requestOptions);
    console.log("🐞 ", response);

    return response;
  } catch (error) {
    console.log(error);
  }
};
