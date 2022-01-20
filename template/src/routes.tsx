import { Navigate, RouteObject } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute';
import { PermissionId } from './constants';
import Index from './pages';
import Login from './pages/login';
import NotFound from './pages/not-found';
import Add from './pages/todo/add';
import List from './pages/todo/list';

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <Index />,
    children: [
      {
        index: true,
        element: <Navigate replace to="todo" />,
      },
      {
        path: 'todo/*',
        children: [
          {
            index: true,
            element: <Navigate replace to="list" />,
          },
          {
            path: 'list',
            element: (
              <PrivateRoute
                permissionId={PermissionId.LIST}
                element={<List />}
              />
            ),
          },
          {
            path: 'add',
            element: (
              <PrivateRoute
                permissionId={PermissionId.LIST}
                element={<Add />}
              />
            ),
          },
          {
            path: '*',
            element: <NotFound />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
