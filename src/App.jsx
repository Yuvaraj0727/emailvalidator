import { BrowserRouter, Routes, Route } from 'react-router-dom'

import EmailValidation from './pages/EmailValidation';
import WeatherPrediction from './pages/WeatherPrediction';


const App = () =>{
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element= { <EmailValidation /> } />  //Email validation component
        <Route path="/weather" element= { <WeatherPrediction /> } />  //Email validation component
      </Routes>
    </BrowserRouter>
  )
}

export default App;