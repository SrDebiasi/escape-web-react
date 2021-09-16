import React from "react";

import Login from "./views/user/login";
import Register from "./views/user/register";
import RoomList from "./views/room/list";
import DashboardView from "./views/dashboard/view";
import DashboardLayout from "./views/layout/dashboard";

const routes = {
    "/dashboard": () => <DashboardLayout><DashboardView/></DashboardLayout>,
    "/login": () => <Login/>,
    "/register": () => <Register/>,
    "/room": () => <DashboardLayout><RoomList/></DashboardLayout>
};

export default routes;
