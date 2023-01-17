export const fetchHandler = async ({
  method,
  path,
  accept,
  body,
  disableCookies,
  headers = {
    "Authorization": "Basic ZGVtbzphc2RmZ2g=", // 👈 ⚠️ Add custom headers to the fetch request (WP back end server authentication)
  },
}) => { 
  try {
    if (!path) throw new Error("No path provided");
    // --------------------------------------------------------------------------------
    // 📌 CUSTOM FETCH HANDLER
    // --------------------------------------------------------------------------------
    method = method || "GET";
    accept = accept || "application/json";

    // --------------------------------------------------------------------------------
    // 📌  API request tim latency. Testing request API latency
    // --------------------------------------------------------------------------------
    let timeNow = new Date();
    let time = `🐞 ${timeNow.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    })}`;

    // 📌 Options
    let requestOptions = {
      method,
      // ⚠️ 🍪 add credentials to the request to included cookies in all fetch requests if disableCookies 🍪
      credentials: disableCookies ? "omit" : "include",
     headers: {
      ...headers, // 📌 add custom headers
     }, 
    };

    let isFormData = requestOptions?.headers?.["Content-Type"]?.includes(
      "multipart/form-data"
    );

    // --------------------------------------------------------------------------------
    // 📌  POST API request body
    // --------------------------------------------------------------------------------
    if (method === "POST" && body) {
      requestOptions = {
        ...requestOptions,
        body: isFormData ? body : JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Accept: accept,
          ...headers,
        },
      };
    }

    // 📌 make a fetch request to the backend api with the given path
    const response = await fetch(path, requestOptions);
    const timeTaken = (new Date().getTime() - timeNow.getTime()) / 1000;

    // ⏰ fetch request timing info
    console.log(`⏰ ${time} Fetch time: ${timeTaken}s`);
    // console.log('🐞 res: ', response);

    return response;
  } catch (error) {
    console.log("🐞 ", error);
  }
};
