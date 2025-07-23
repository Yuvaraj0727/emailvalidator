import { BrowserRouter, Routes, Route } from 'react-router-dom'

import EmailValidation from './pages/EmailValidation';


const App = () =>{
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element= { <EmailValidation /> } />  //Email validation component
      </Routes>
    </BrowserRouter>
  )
}

export default App;