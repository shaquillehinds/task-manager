import React, { useContext } from "react";
import { Context } from "./Context";
import { Link } from "react-router-dom";
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
    setUserData(() => [{}, []]);
  };
  return (
    <header>
      <h1>Task Manager</h1>
      {userData[0].name && (
        <nav>
          <ul>
            <li>Profile</li>
            <li>Tasks</li>
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
