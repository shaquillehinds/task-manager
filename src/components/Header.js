import React, { useContext } from "react";
import { Context } from "./Context";
import { render } from "react-dom";

const Header = () => {
  const [tasks, setTasks] = useContext(Context);
  const addTask = () => {
    const newTask = { description: "Go for a walk", completed: false };
    setTasks((prev) => [...prev, newTask]);
  };
  const resetTask = () => {
    setTasks(() => [{ description: "Drive to work", completed: false }]);
  };
  return (
    <div>
      {tasks.map((task) => task.description)}
      <button onClick={addTask}>Add Task</button>
      <button onClick={resetTask}>Reset</button>
    </div>
  );
};

export default Header;
