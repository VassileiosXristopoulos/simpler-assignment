import Home from '../pages/Home';
import Shop from 'pages/Shop';
import { RouterType } from 'types';

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
