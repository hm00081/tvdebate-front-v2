import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import store from "./redux/store";

// container가 null이 아닌 경우에만 root를 생성
const container = document.getElementById("root");
if (container) {
  const root = ReactDOM.createRoot(container);

  root.render(
    //@ts-ignore
    <Provider store={store}>
      <App />
    </Provider>
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
