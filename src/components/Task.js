import React from "react";

const Task = ({ description }) => {
  return (
    <div className="task">
      <div className="task__box">
        <p className="task__text">{description}</p>
      </div>
      <div className="task__edit"></div>
      <div className="task__delete"></div>
    </div>
  );
};

export default Task;
