import React, { useState } from "react";
import { connect } from "frontity";

const CreateAccount = ({ state, actions }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // HELPERS ------------------------------------------------------------
  const handleUserLogin = async () => {
    console.log("handleUserLogin triggered");
    const URL = "http://localhost:8888/events/wp-json/jwt-auth/v1/token";

    const userCredentials = JSON.stringify({
      username: "user",
      password: "password",
    });
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: userCredentials,
    };
    try {
      const data = await fetch(URL, requestOptions);
      const response = await data.json();
      if (response.token) {
        return response.token;
      } else {
        console.log("Failed to auth");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCreateAccount = async () => {
    console.log("handleCreateAccount triggered");
    if (password !== confirmPassword || password === "" || email === "") {
      console.log(
        "Passwords do not match or inputs invalid: ",
        username,
        email,
        password
      ); //debug
      return;
    }
    const jwt = await handleUserLogin();
    if (!jwt) return;
    const URL = "http://localhost:8888/events/wp-json/wp/v2/users";

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    };
    const userCredentials = JSON.stringify({
      username,
      email,
      password,
    });
    const requestOptions = {
      method: "POST",
      headers,
      body: userCredentials,
    };

    try {
      const data = await fetch(URL, requestOptions);
      const response = await data.json();
      console.log("user create response ------", response);
      if (response.id) {
        actions.router.set("/");
        actions.theme.setLogin(true);
      } else {
        alert(`${response.message}`);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      <div className="form-group">
        <label>Username</label>
        <input
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          className="form-control"
          placeholder="Enter username"
        />
      </div>
      <div className="form-group">
        <label>Email address</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="form-control"
          placeholder="Enter email"
        />
        <small id="emailHelp" className="form-text text-muted">
          We'll never share your email with anyone else.
        </small>
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
          placeholder="Password"
        />
      </div>
      <div className="form-group">
        <label>Confirm Password</label>
        <input
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          className="form-control"
          placeholder="Password"
        />
      </div>
      <div className="form-group form-check">
        <input type="checkbox" className="form-check-input" />
        <label className="form-check-label">Check me out</label>
      </div>
      <div className="blue-btn" onClick={handleCreateAccount}>
        Create Account
      </div>
    </div>
  );
};

export default connect(CreateAccount);
