import React from "react";
import axios from "axios";
import { Context } from "./Context";

export default class Home extends React.Component {
  componentWillMount() {
    if (localStorage.getItem("JWT")) {
      const JWT = localStorage.getItem("JWT");
      axios({
        method: "get",
        url: "http://localhost:3000",
        headers: { Authorization: `Bearer ${JWT}` },
      });
    }
  }
  render() {}
}
