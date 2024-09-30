import * as React from "react";
import { Outlet, createRootRoute, Link } from "@tanstack/react-router";

export const Route = createRootRoute({
    component: () => (
        <React.Fragment>
            <nav>
                <Link to="/">Cafes</Link> |{" "}
                <Link to="/employee">Employees</Link>
            </nav>
            <hr />
            <Outlet />
        </React.Fragment>
    ),
});
