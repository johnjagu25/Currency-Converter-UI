import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Exchange from "./components/Exchange/Exchange";
import SignUp from "./components/Login/SignUp";
import { Fragment } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const notify = (msg) => toast(msg);
function App() {  
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp/>}></Route>
          <Route path="/exchange" element={<Exchange />}></Route>
          <Route path="*" element={<Login />}>
            {" "}
          </Route>
        </Routes>
      </Router>

      <ToastContainer
        toastStyle={{ backgroundColor: "black", color: "white" }}
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
      />
    </Fragment>
  );
}

export default App;
