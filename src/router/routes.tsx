// src/router/routes.tsx
import type { RouteObject } from 'react-router-dom';
import Home from '../pages/Home';
import QnA from '../pages/QnA';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/qna',
    element: <QnA />,
  },
];
