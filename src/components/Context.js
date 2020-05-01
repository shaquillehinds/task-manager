import React, { useState, createContext } from "react";

export const Context = createContext();

export const Provider = (props) => {
  const [tasks, setTasks] = useState([
    { description: "Drive to work", completed: false },
  ]);
  return (
    <Context.Provider value={[tasks, setTasks]}>
      {props.children}
    </Context.Provider>
  );
};
