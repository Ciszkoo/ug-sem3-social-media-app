import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthProviderLayout from "./components/AuthProviderLayout";
import { Provider as StoreProvider } from "react-redux";
import "./index.css";

import LoginPage from "./routes/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { store } from "./store";
import axios from "axios";
import UserInfoPage from "./routes/UserInfoPage";
import UserRoute from "./routes/UserRoute";
import UserTimeline from "./components/UserPage/UserTimeline";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5000";

const router = createBrowserRouter([
  {
    element: <AuthProviderLayout />,
    children: [
      {
        path: "/",
        element: <LoginPage />,
      },
      {
        path: "/user/:id",
        element: (
          <ProtectedRoute>
            <UserRoute />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "",
            element: <UserTimeline />,
          },
          {
            path: "edit",
            element: <UserInfoPage />,
          },
        ],
      },
      {
        path: "*",
        element: <h1>404</h1>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <RouterProvider router={router} />
    </StoreProvider>
  </React.StrictMode>
);
