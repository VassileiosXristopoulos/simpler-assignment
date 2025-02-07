import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Router from 'pages/Router';
import pagesData from 'router/pages';
import { ErrorBoundary } from 'components/ErrorBoundary';


function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Router pages={pagesData} />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
