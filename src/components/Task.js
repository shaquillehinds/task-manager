import React from "react";

const Task = ({ description, id, deleteTask }) => {
  return (
    <div className="task">
      <div className="task__box">
        <p className="task__text">{description}</p>
      </div>
      <div className="task__edit"></div>
      <div onClick={deleteTask} data-id={id} className="task__delete">
        X
      </div>
    </div>
  );
};

export default Task;
