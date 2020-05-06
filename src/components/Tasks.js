import React, { useContext, useState } from "react";
import { Context } from "./Context";
import Task from "./Task";

const Tasks = () => {
  const [userData, setUserData] = useContext(Context);
  return (
    <div>
      <h1>Tasks</h1>
      <div className="filter-Sort">
        <div className="filter">
          <label className="filter__title">Filter</label>
          <select name="filter" id="filter__select">
            <option value="Completed">Completed</option>
            <option value="Incomplete">Incomplete</option>
          </select>
        </div>
        <div className="sort">
          <label className="sort__title">Sort</label>
          <select name="sort" id="sort__select">
            <option value="Name">Name</option>
            <option value="Date">Date</option>
          </select>
        </div>
      </div>
      <form className="new-task">
        <input type="text" />
        <input type="submit" value="Add Task" />
      </form>
      <div className="tasks">
        {userData.tasks.length > 0
          ? userData.tasks.map((task) => <Task description={task.description} />)
          : false}
      </div>
      <div className="page-selection"></div>
    </div>
  );
};

export default Tasks;
