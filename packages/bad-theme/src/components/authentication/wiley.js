import { useState, useEffect } from "react";
import { connect } from "frontity";
// CONTEXT ----------------------------------------------------------------
import { useAppDispatch, useAppState, fetchDataHandler } from "../../context";

const Wileys = ({ state, actions, libraries }) => {
  const Html2React = libraries.html2react.Component; // Get the component exposed by html2react.

  const [iFrameSrc, setiFrameSrc] = useState("");
  const [doi, setDoi] = useState("doi/10.1111/bjd.21021");

  let scope = "admin"; // test var
  let inScope = ["admin", "wiley"].includes(scope);

  async function executeScript(e) {
    e.preventDefault();
    const request = {
      url: "https://skylarkdev.digital/dynamicsbridge/wiley",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    // --------------------------------------------------------------------------
    // Look on RSS feed to see if it comes with DOI values
    // --------------------------------------------------------------------------
    if (doi) request.body = JSON.stringify({ doi });
    // let wiley = await axios.post(request);

    let wiley = await fetchDataHandler({ path: request.url, state });
    if (wiley.ok) {
      wiley = await wiley.json();
      return setiFrameSrc(wiley.data);
    }
    // Handle error (this will change when we go live)
    return setiFrameSrc(`https://example.com/error`);
  }

  if (!inScope) {
    return (
      <div className="row">
        <div className="col-md-3 offset-md-5">
          <h1 className="text-center">Disabled</h1>
          <p className="text-center">
            This page is currently disabled (your user may not have permission
            to view)
          </p>
        </div>
      </div>
    );
  }

  // HELPERS ---------------------------------------------

  return (
    <div className="row shadow">
      <div className="col-md-10 offset-md-1">
        <div className="row">
          <h2>Wileys TPS Test</h2>
        </div>
        <form>
          <div className="form-group row mt-4">
            <label className="col-md-2 col-form-label">
              Publication DOI/Blank
            </label>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                value={doi}
                onChange={(e) => setiFrameSrc("") || setDoi(e.target.value)}
              />
            </div>
            <div className="col-md-1">
              <div
                className="btn-success"
                onClick={(e) =>
                  e.preventDefault() || setiFrameSrc("") || setDoi("")
                }
              >
                Clear
              </div>
            </div>
          </div>
          <div className="row">
            <label className="col-md-2 col-form-label">&nbsp;</label>
            <div className="col-md-3 ">
              <div className="btn-info form-control" onClick={executeScript}>
                Click here to get URL
              </div>
            </div>
          </div>
          <div className="row">
            <label className="col-md-6 offset-md-2 col-form-label">
              Enter a valid DOI string into the box above to retrieve a URL for
              that journal. If you leave this box blank the we will go to the
              advanced search page on the Wileys site,{" "}
              <b>but with an authenticated URL</b>. When the URL is retrieved
              from our back end API server, you will see a link below. Click on
              this link and we will open a new Browser tab pointing to the
              retrieved URL.
            </label>
          </div>
        </form>
        {iFrameSrc && (
          <div className="row mt-5">
            <div className="col-md-4 offset-md-3 alert alert-success">
              <div className="alert-heading">
                <h3>We now have the Wileys content URL</h3>
              </div>
              <p>
                Click on the link here to view the content:
                <a
                  className="ml-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={iFrameSrc}
                >
                  &nbsp;Click Me
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {},
};

export default connect(Wileys);
