import React, { useState, useContext, useEffect } from "react";
import { Context } from "./Context";

const CenterModalContainer = (props) => {
  const [userData, setUserData] = useContext(Context);
  const [formState, setFormState] = useState({ name: "", email: "", password: "", task: "" });
  const onEmailStateChange = (e) => {
    e.persist();
    setFormState((prev) => ({ ...prev, email: e.target.value }));
  };
  const onPasswordStateChange = (e) => {
    e.persist();
    setFormState((prev) => ({ ...prev, password: e.target.value }));
  };
  const onNameStateChange = (e) => {
    e.persist();
    setFormState((prev) => ({ ...prev, name: e.target.value }));
  };
  const onTaskStateChange = (e) => {
    e.persist();
    setFormState((prev) => ({ ...prev, task: e.target.value }));
  };
  useEffect(() => {
    setFormState((prev) => ({ ...prev, task: "" }));
  }, [userData.tasks.length]);
  return (
    <div>
      {props.name === "welcome" && (
        <div>
          <h1>Welcome</h1>
          <p>Please login to start creating new tasks.</p>
          <button onClick={props.handler} value="welcomeLogin">
            Login
          </button>
          <button onClick={props.handler} value="welcomeSignUp">
            Sign Up
          </button>
        </div>
      )}
      {props.name === "signUp" && (
        <div>
          <form onSubmit={props.handler}>
            <label>Name</label>
            <input onChange={onNameStateChange} value={formState.name} type="text" id="signUpName" />
            <label>Email</label>
            <input onChange={onEmailStateChange} value={formState.email} type="text" id="signUpEmail" />
            <label>Password</label>
            <input
              onChange={onPasswordStateChange}
              value={formState.password}
              type="password"
              id="signUpPassword"
            />
            <button value="signUp">Sign Up</button>
          </form>
        </div>
      )}
      {props.name === "login" && (
        <div>
          <form onSubmit={props.handler}>
            <label>Email</label>
            <input onChange={onEmailStateChange} value={formState.email} type="text" id="loginEmail" />
            <label>Password</label>
            <input
              onChange={onPasswordStateChange}
              value={formState.password}
              type="password"
              id="loginPassword"
            />
            <button value="login">Login</button>
          </form>
        </div>
      )}
      {props.name === "loggedIn" && (
        <div>
          <form onSubmit={props.handler}>
            <label>New Task</label>
            <input onChange={onTaskStateChange} value={formState.task} type="text" id="homeTask" />
            <button value="create">Create</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CenterModalContainer;
