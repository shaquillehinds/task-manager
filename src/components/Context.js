import React, { useState, createContext } from "react";

export const Context = createContext();

export const Provider = (props) => {
  const [userData, setUserData] = useState({
    user: {},
    tasks: [],
    count: 0,
    completed: 0,
    notCompleted: 0,
  });
  return <Context.Provider value={[userData, setUserData]}>{props.children}</Context.Provider>;
};
