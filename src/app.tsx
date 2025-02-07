import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Router from 'pages/Router';
import pagesData from 'router/pages';


function App() {
  return (
    <BrowserRouter>
      <Router pages={pagesData} />
    </BrowserRouter>
  );
}

export default App;
