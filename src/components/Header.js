import React, { useContext } from "react";
import { Context } from "./Context";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [userData, setUserData] = useContext(Context);
  const logOutUser = async () => {
    try {
      const loggedOut = await axios({
        method: "post",
        url: `${process.env.URL}/users/logout`,
        headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
      });
      console.log(loggedOut.data);
    } catch (e) {}
    localStorage.removeItem("JWT");
    setUserData(() => ({ user: {}, tasks: [], count: 0, completed: 0, notCompleted: 0 }));
  };
  return (
    <header>
      <h1>
        <Link to="/">Task Manager</Link>
      </h1>
      {userData.user.name && (
        <nav>
          <ul>
            <li>
              <NavLink to="/profile" activeClassName="is-active">
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink to="/tasks" activeClassName="is-active">
                Tasks
              </NavLink>
            </li>
            <li>
              <Link onClick={logOutUser} to="/">
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
