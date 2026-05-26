import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import RedirectingPage from "./pages/RedirectingPage";


const App = () => {

  return(
    <BrowserRouter>
      <Routes>
        <Route path= '/' element = {<LandingPage />} />
        <Route path = '/:shortCode' element = {<RedirectingPage />} />
      </Routes>
    </BrowserRouter>
  )

}

export default App;