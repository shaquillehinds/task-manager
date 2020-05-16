import React, { useContext, useState } from "react";
import { Context } from "./Context";
import Task from "./Task";
import axios from "axios";

const Tasks = () => {
  const [userData, setUserData] = useContext(Context);
  const [state, setState] = useState({
    newTask: "",
    filter: "",
    sort: "",
    filterQuery: "",
    sortQuery: "",
    skip: 0,
  });

  const submitNewTask = (e) => {
    e.preventDefault();
    if (state.newTask.length > 0) {
      axios({
        method: "post",
        headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
        url: `${process.env.URL}/tasks`,
        data: { description: state.newTask },
      })
        .then((res) => {
          if (userData.tasks.length < 10) {
            setUserData((prev) => ({
              ...prev,
              tasks: [...prev.tasks, res.data],
            }));
          }
        })
        .catch((e) => console.log(e));

      setState((prev) => ({ ...prev, newTask: "" }));
    }
  };
  const deleteTask = async (e) => {
    const id = e.target.getAttribute("data-id");
    await axios({
      method: "delete",
      url: `${process.env.URL}/tasks/${id}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
    });
    let url = `${process.env.URL}/tasks?${state.filterQuery}&${state.sortQuery}&skip=${state.skip}`;

    const tasks = await axios({
      method: "get",
      url,
      headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
    });
    setUserData((prev) => ({ ...prev, tasks: tasks.data.tasks }));
  };
  const setFilter = async (e) => {
    const filter = e.target.value;
    if (filter !== "None") {
      let url;
      if (state.sortQuery) {
        url = `${process.env.URL}/tasks?completed=${filter}&${state.sortQuery}&skip=0`;
      } else {
        url = `${process.env.URL}/tasks?completed=${filter}&skip=0`;
      }
      const filtered = await axios({
        method: "get",
        url,
        headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
      });
      setUserData((prev) => ({ ...prev, tasks: filtered.data.tasks }));
      setState((prev) => ({
        ...prev,
        filterQuery: `completed=${filter}`,
        filter,
      }));
    } else {
      const url = `${process.env.URL}/tasks?skip=0&${state.sortQuery}`;
      const data = await axios({
        method: "get",
        url,
        headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
      });
      setUserData((prev) => ({ ...prev, tasks: data.data.tasks }));
      setState((prev) => ({ ...prev, filter: "None", filterQuery: "" }));
    }
    setState((prev) => ({ ...prev, skip: 0 }));
  };
  const setSort = (e) => {
    const sort = e.target.value;
    let url;
    if (state.filterQuery) {
      url = `${process.env.URL}/tasks?sort=${encodeURIComponent(sort)}&completed=${
        state.filterQuery
      }&skip=0`;
    } else {
      url = `${process.env.URL}/tasks?sort=${encodeURIComponent(sort)}&skip=0`;
    }

    (async () => {
      const sorted = await axios({
        method: "get",
        url,
        headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
      });
      setUserData((prev) => ({ ...prev, tasks: sorted.data.tasks }));
      setState((prev) => ({
        ...prev,
        sortQuery: `sort=${sort}`,
        sort,
      }));
    })();
    setState((prev) => ({ ...prev, skip: 0 }));
  };
  const nextTasks = async () => {
    const data = await axios({
      method: "get",
      url: `${process.env.URL}/tasks?skip=${state.skip + 10}&${state.filterQuery}&${state.sortQuery}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
    });
    setUserData((prev) => ({ ...prev, tasks: data.data.tasks }));
    setState((prev) => ({ ...prev, skip: prev.skip + 10 }));
  };
  const previousTasks = async () => {
    const data = await axios({
      method: "get",
      url: `${process.env.URL}/tasks?skip=${state.skip - 10}&${state.filterQuery}&${state.sortQuery}`,
      headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
    });
    setUserData((prev) => ({ ...prev, tasks: data.data.tasks }));
    setState((prev) => ({ ...prev, skip: prev.skip - 10 }));
  };
  return (
    <div>
      <h1>Tasks</h1>
      <div className="filter-Sort">
        <div className="filter">
          <label className="filter__title">Filter</label>
          <select name="filter" id="filter__select" value={state.filter} onChange={setFilter}>
            <option value="None">None</option>
            <option value="false">Incomplete</option>
            <option value="true">Completed</option>
          </select>
        </div>
        <div className="sort">
          <label className="sort__title">Sort</label>
          <select name="sort" id="sort__select" value={state.sort} onChange={setSort}>
            <option value="Date Latest">Date (Latest)</option>
            <option value="Date Oldest">Date (Oldest)</option>
            <option value="Name Asc">Name (Asc)</option>
            <option value="Name Desc">Name (Desc)</option>
          </select>
        </div>
      </div>
      <form className="new-task" onSubmit={submitNewTask}>
        <input
          type="text"
          value={state.newTask}
          onChange={(e) => {
            e.persist();
            setState((prev) => ({ ...prev, newTask: e.target.value }));
          }}
        />
        <input type="submit" value="Add Task" />
      </form>
      <div className="tasks">
        {userData.tasks.length > 0
          ? userData.tasks.map((task) => (
              <Task
                key={task._id}
                description={task.description}
                id={task._id}
                deleteTask={deleteTask}
              />
            ))
          : false}
      </div>
      <div className="page-selection">
        <button onClick={previousTasks} disabled={state.skip === 0}>
          Prev
        </button>
        <button onClick={nextTasks} disabled={userData.tasks.length < 10}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Tasks;
