import React, { useContext, useEffect } from "react";
import axios from "axios";
import { Context } from "./Context";

const Home = () => {
  const [userData, setUserData] = useContext(Context);
  useEffect(() => {
    if (localStorage.getItem("JWT")) {
      const JWT = localStorage.getItem("JWT");
      axios({
        method: "get",
        url: `${process.env.URL}/users/me`,
        headers: { Authorization: `Bearer ${JWT}` },
      })
        .then((res) => {
          setUserData((prev) => {
            return [res.data, []];
          });
          console.log(res.data);
        })
        .catch((e) => console.log(e));
    }
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      {userData[0].name}
    </div>
  );
};

export default Home;
