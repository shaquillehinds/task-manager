import React, { useContext, useState, useEffect } from "react";
import { Context } from "./Context";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useContext(Context);
  const [state, setState] = useState({
    update: false,
    name: userData.user.name,
    age: userData.user.age,
    email: userData.user.email,
    password: "",
    count: 0,
    file: undefined,
    pic: `${process.env.URL}/users/${userData.user._id}/avatar`,
  });
  const onNameChange = (e) => {
    e.persist();
    setState((prev) => ({ ...prev, name: e.target.value }));
  };
  const onAgeChange = (e) => {
    e.persist();
    setState((prev) => ({ ...prev, age: Number(e.target.value) }));
  };
  const onEmailChange = (e) => {
    e.persist();
    setState((prev) => ({ ...prev, email: e.target.value }));
  };
  const onPasswordChange = (e) => {
    e.persist();
    setState((prev) => ({ ...prev, password: e.target.value, count: (prev.count += 1) }));
  };
  const removePicHandler = () => {
    axios({
      method: "delete",
      headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
      url: `${process.env.URL}/users/me/avatar`,
    })
      .then(() => {
        const random = Math.random();
        setState((prev) => ({
          ...prev,
          pic: `${process.env.URL}/users/${userData.user._id}/avatar?${random}`,
        }));
      })
      .catch((e) => console.log(e));
  };
  const fileHandler = (e) => {
    const file = e.target.files[0];
    setState((prev) => ({ ...prev, file }));
  };
  const uploadImageHandler = (e) => {
    e.preventDefault();
    if (state.file) {
      const file = state.file;
      const formData = new FormData();
      formData.append("avatar", file);
      axios({
        method: "post",
        url: `${process.env.URL}/users/me/avatar`,
        data: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("JWT")}`,
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          const random = Math.random();
          setState((prev) => ({
            ...prev,
            pic: `${process.env.URL}/users/${userData.user._id}/avatar?${random}`,
          }));
        })
        .catch((e) => console.log(e));
    }
  };
  const updateUser = async (update) => {
    const { data } = await axios({
      method: "patch",
      url: `${process.env.URL}/users/me`,
      data: { update },
      headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
    });
    return data;
  };
  const formSubmitHandler = (e) => {
    e.preventDefault();
    e.child;
    let changed = false;
    let update = {};
    for (let prop in state) {
      if (Object.keys(userData.user).includes(prop) && state[prop] !== userData.user[prop]) {
        changed = true;
        update[prop] = state[prop];
      }
      if (state.count > 1 && state.password.length > 7) {
        changed = true;
        update.password = state.password;
      }
    }
    (async () => {
      if (changed) {
        const user = await updateUser(update);
        await setUserData((prev) => ({ ...prev, user }));
        setState((prev) => ({ ...prev, update: false }));
      }
    })();
  };
  return (
    <div>
      <div>
        {state.update ? (
          <div>
            <img src={state.pic} alt="User Profile Image" />
            <button onClick={removePicHandler}>Remove Profile Pic</button>
            <form onSubmit={uploadImageHandler}>
              <label>Upload New Profile Pic</label>
              <input onChange={fileHandler} type="file"></input>
              <button>Upload</button>
            </form>
            <form autoComplete="off" onSubmit={formSubmitHandler}>
              <label>Name</label>
              <input value={state.name} type="text" onChange={onNameChange} />
              <label>Age</label>
              <input value={state.age} type="text" onChange={onAgeChange} />
              <label>Email</label>
              <input value={state.email} type="text" onChange={onEmailChange} />
              <label>Password</label>
              <input
                autoComplete="off"
                value={state.password}
                type="password"
                id="updatePassword"
                onChange={onPasswordChange}
              />
              <button>Update</button>
            </form>
            <button onClick={() => setState((prev) => ({ ...prev, update: false }))}>Cancel</button>
          </div>
        ) : (
          <div>
            <img src={state.pic} alt="User Profile Image" />
            <h3>{userData.user.name}</h3>
            <p>
              <span>Age: </span>
              {userData.user.age}
            </p>
            <p>
              <span>Email: </span>
              {userData.user.email}
            </p>
            <p>
              <span>Tasks: </span>
              {userData.count || 0}
            </p>
            <p>
              <span>Completed: </span>
              {userData.completed || 0}
            </p>
            <button onClick={() => setState((prev) => ({ ...prev, update: true }))}>Edit</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
