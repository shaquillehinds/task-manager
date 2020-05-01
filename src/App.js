import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "./components/Context";
import Profile from "./components/Profile";
import Home from "./components/Home";
import Header from "./components/Header";

const App = () => {
  return (
    <Provider>
      <Router>
        <div>
          <Header />

          <Route path="/profile" component={Profile} />
          <Route path="/" component={Home} />
        </div>
      </Router>
    </Provider>
  );
};

export default App;
