import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { DivWrapper } from "./screens/DivWrapper";
import { Spend } from "./screens/Spend";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DivWrapper />,
  },
  {
    path: "/spend",
    element: <Spend />,
  },
  {
    path: "/u4352u4462u4358u4450-u4370u4455u4523u4370u4458u4540-u4358u4469u4542-u4359u4462u4523u4361u4453u4520u40spend-u4359u4462u4523u4361u4453u4520u41",
    element: <Spend />,
  },
  {
    path: "/u4352u4462u4358u4450-u4370u4455u4523u4370u4458u4540-u4358u4469u4542-u4359u4462u4523u4361u4453u4520u40u4358u4454u4363u4469u4523-u4370u4458u4358u4455u4523u41",
    element: <DivWrapper />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
