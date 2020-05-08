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
        .then((res) =>
          setUserData((prev) => ({
            ...prev,
            tasks: [...prev.tasks, res.data],
          }))
        )
        .catch((e) => console.log(e));

      setState((prev) => ({ ...prev, newTask: "" }));
    }
  };
  const setFilter = (e) => {
    const filter = e.target.value;
    if (filter !== "None") {
      let url;
      if (state.sortQuery) {
        url = `${process.env.URL}/tasks?completed=${filter}&${state.sortQuery}`;
      } else {
        url = `${process.env.URL}/tasks?completed=${filter}`;
      }

      (async () => {
        console.log(filter);
        const filtered = await axios({
          method: "get",
          url,
          headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
        });
        console.log(filtered.data);
        setUserData((prev) => ({ ...prev, tasks: filtered.data.tasks }));
        setState((prev) => ({
          ...prev,
          filterQuery: `?completed=${filter}`,
          filter,
        }));
      })();
    }
  };
  const setSort = (e) => {
    const sort = e.target.value;
    let url;
    if (state.filterQuery) {
      url = `${process.env.URL}/tasks?completed=${sort}&${state.filterQuery}`;
    } else {
      url = `${process.env.URL}/tasks?completed=${sort}`;
    }

    (async () => {
      console.log(sort);
      const sorted = await axios({
        method: "get",
        url,
        headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
      });
      console.log(sorted.data);
      setUserData((prev) => ({ ...prev, tasks: sorted.data.tasks }));
      setState((prev) => ({
        ...prev,
        sortQuery: `?completed=${sort}`,
        sort,
      }));
    })();
  };
  return (
    <div>
      <h1>Tasks</h1>
      <div className="filter-Sort">
        <div className="filter">
          <label className="filter__title">Filter</label>
          <select
            name="filter"
            id="filter__select"
            value={state.filter}
            onChange={setFilter}
          >
            <option value="None">None</option>
            <option value="false">Incomplete</option>
            <option value="true">Completed</option>
          </select>
        </div>
        <div className="sort">
          <label className="sort__title">Sort</label>
          <select
            name="sort"
            id="sort__select"
            value={state.sort}
            onChange={setSort}
          >
            <option value="Date (Oldest)">Date Oldest</option>
            <option value="Date (Latest)">Date Latest</option>
            <option value="Name">Name</option>
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
              <Task key={task._id} description={task.description} />
            ))
          : false}
      </div>
      <div className="page-selection"></div>
    </div>
  );
};

export default Tasks;
