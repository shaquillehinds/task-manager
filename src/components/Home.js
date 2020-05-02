import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "./Context";
import CenterModalContainer from "./CenterModalContainer";

const Home = () => {
  const [userData, setUserData] = useContext(Context);
  const [state, setState] = useState({ current: "welcome" });
  useEffect(() => {
    if (localStorage.getItem("JWT")) {
      const JWT = localStorage.getItem("JWT");
      axios({
        method: "get",
        url: `${process.env.URL}/users/me`,
        headers: { Authorization: `Bearer ${JWT}` },
      })
        .then((res) => {
          setUserData((prev) => {
            return [res.data, []];
          });
          setState(() => ({ current: "loggedIn" }));
        })
        .catch((e) => console.log(e));
    }
  }, []);
  useEffect(() => {
    !userData[0].name ? setState({ current: "welcome" }) : true;
  }, [userData[0]]);
  const modalActionHandler = (e) => {
    e.preventDefault();
    const action = e.target.value || e.target.lastElementChild.value;
    switch (action) {
      case "welcomeLogin":
        return setState({ current: "login" });
      case "welcomeSignUp":
        return setState({ current: "signUp" });
      case "signUp":
        const email = document.getElementById("signUpEmail").value;
        const password = document.getElementById("signUpPassword").value;
        const name = document.getElementById("signUpName").value;
        const newUser = async () => {
          try {
            const data = await axios.post(`${process.env.URL}/users`, { name, email, password });
            const tasks = await axios({
              method: "get",
              url: `${process.env.URL}/tasks`,
              headers: { Authorization: `Bearer ${data.data.token}` },
            });
            setUserData(() => {
              return [data.data.user, tasks.data];
            });
            localStorage.setItem("JWT", data.data.token);
            setState({ current: "loggedIn" });
          } catch (e) {
            console.log(e);
          }
        };
        newUser();
        return true;
      case "login":
        const loginUser = async () => {
          const email = document.getElementById("loginEmail").value;
          const password = document.getElementById("loginPassword").value;
          try {
            const userData = await axios.post(`${process.env.URL}/users/login`, { email, password });
            const tasks = await axios({
              method: "get",
              url: `${process.env.URL}/tasks`,
              headers: { Authorization: `Bearer ${userData.data.newToken}` },
            });
            setUserData(() => [userData.data.user, tasks.data]);
            setState(() => ({ current: "loggedIn" }));
            localStorage.setItem("JWT", userData.data.newToken);
            console.log(tasks.data);
          } catch (e) {
            console.log(e);
          }
        };
        loginUser();
        return true;
      case "create":
        const task = document.getElementById("homeTask");
        const addNewTask = async () => {
          try {
            const savedTask = await axios({
              method: "post",
              data: { description: task.value },
              url: `${process.env.URL}/tasks`,
              headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
            });
            setUserData((prev) => {
              const newState = [...prev];
              newState[1].push(savedTask.data);
              return newState;
            });
          } catch (e) {
            console.log(e);
          }
        };
        addNewTask();
        return setState({ current: "loggedIn" });
      default:
        return setState({ current: "welcome" });
    }
    console.log(action);
  };
  return (
    <div>
      <CenterModalContainer name={state.current} handler={modalActionHandler} />
    </div>
  );
};

export default Home;
