import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout';
import { routes } from './routes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: routes,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}