import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Exchange from './components/Exchange/Exchange';
import SignUp from './components/Login/SignUp';
import { Fragment } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {  
  const notify = (msg) => toast(msg);
  return (
    <Fragment>
      <Router>
      <Routes>
      <Route path="/" element={<Login notify={notify}/>}>    
      </Route>
      <Route path="/signup" element={<SignUp notify={notify}/>}>    
      </Route>      
      <Route path="/exchange" element={<Exchange/>}></Route>
      <Route path="*" element={<Login/>}> </Route>
    </Routes>
      </Router>

<ToastContainer toastStyle={{ backgroundColor: "black",color:"white" }} position="bottom-center" autoClose={3000}  hideProgressBar/>
    
    </Fragment>
  );
}

export default App;
