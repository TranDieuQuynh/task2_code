import { createBrowserRouter } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import ProfileSettings from '../pages/ProfileSettings';
import ProjectsSettings from '../pages/ProjectsSettings';
import Portfolio from '../pages/Portfolio';
import Layout from '../components/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Portfolio />,
      },
      {
        path: '/profile',
        element: <ProfileSettings />,
      },
      {
        path: '/projects',
        element: <ProjectsSettings />,
      },
    ],
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
]);

export default router; 