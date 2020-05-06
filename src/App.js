import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "./components/Context";
import Profile from "./components/Profile";
import Tasks from "./components/Tasks";
import Home from "./components/Home";
import Header from "./components/Header";
import NotFoundPage from "./components/NotFoundPage.js";

const App = () => {
  return (
    <Provider>
      <Router>
        <div>
          <Header />
          <Switch>
            <Route path="/profile" component={Profile} />
            <Route path="/tasks" component={Tasks} />
            <Route path="/" component={Home} />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
