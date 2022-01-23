import React from "react";
import ReactDOM from "react-dom";
import App from "./App1";
import App1 from "./App";
import { initContract } from "./utils/near";

import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

window.nearInitPromise = initContract()
  .then(() => {
    ReactDOM.render(
      <Router>
        <Provider store={store}>
          <App1 />
        </Provider>
      </Router>,
      document.querySelector("#root")
    );
  })
  .catch(console.error);
