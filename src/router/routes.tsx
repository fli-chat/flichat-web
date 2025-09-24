import type { RouteObject } from "react-router-dom";
import Home from "../pages/Home";
import QnA from "../pages/QnA";
import ChatLayout from "../components/ChatLayout";
import ChatLogin from "../pages/ChatLogin";
import ChatPage from "../pages/ChatPage";

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/qna',
    element: <QnA />,
  },
  {
    path: '/chat',
    element: <ChatLayout />,
    children: [
      {
        path: '',
        element: <ChatPage />,
      },
      {
        path: 'login',
        element: <ChatLogin />,
      },

    ],
  },
];