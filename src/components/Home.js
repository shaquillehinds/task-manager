import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "./Context";
import CenterModalContainer from "./CenterModalContainer";

const Home = () => {
  const [userData, setUserData] = useContext(Context);
  let current;
  userData.user.name ? (current = "loggedIn") : (current = "welcome");
  const [state, setState] = useState({ current });
  useEffect(() => {
    if (localStorage.getItem("JWT") && !userData.user.name) {
      const JWT = localStorage.getItem("JWT");
      const getUserData = async () => {
        try {
          const res = await axios({
            method: "get",
            url: `${process.env.URL}/users/me`,
            headers: { Authorization: `Bearer ${JWT}` },
          });
          const { data } = await axios({
            method: "get",
            url: `${process.env.URL}/tasks`,
            headers: { Authorization: `Bearer ${JWT}` },
          });
          const { tasks, count, completed, notCompleted } = data;
          const user = res.data;
          setUserData((prev) => ({ user, tasks, count, completed, notCompleted }));
          setState(() => ({ current: "loggedIn" }));
        } catch (e) {
          console.log(e);
        }
      };
      getUserData();
    }
  }, []);
  useEffect(() => {
    !userData.user.name ? setState({ current: "welcome" }) : true;
  }, [userData.tasks]);
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
            const { data } = await axios.post(`${process.env.URL}/users`, { name, email, password });
            const tasks = await axios({
              method: "get",
              url: `${process.env.URL}/tasks`,
              headers: { Authorization: `Bearer ${data.token}` },
            });
            setUserData((...prev) => {
              return { ...prev, user: data.user, tasks: tasks.data };
            });
            localStorage.setItem("JWT", data.token);
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
            const { data } = await axios({
              method: "get",
              url: `${process.env.URL}/tasks`,
              headers: { Authorization: `Bearer ${userData.data.newToken}` },
            });
            const { tasks, count, completed, notCompleted } = data;
            setUserData((prev) => ({
              ...prev,
              user: userData.data.user,
              tasks,
              count,
              completed,
              notCompleted,
            }));
            setState(() => ({ current: "loggedIn" }));
            localStorage.setItem("JWT", userData.data.newToken);
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
            const { data } = await axios({
              method: "post",
              data: { description: task.value },
              url: `${process.env.URL}/tasks`,
              headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
            });
            setUserData((prev) => {
              const newState = { ...prev };
              newState.tasks.push(data);
              newState.count += 1;
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
