import { lazy } from 'react';
import { RouterType } from 'types';

const Home = lazy(() => import('../pages/Home'));
const Shop = lazy(() => import('../pages/Shop'));

const pagesData: RouterType[] = [
  {
    path: '',
    element: <Home />,
    title: 'Home',
  },
  {
    path: 'shop',
    element: <Shop />,
    title: 'Shop',
  },
];

export default pagesData;
