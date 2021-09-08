import './App.css';
import React, {useContext} from 'react';
import Header from './Component/Header';
import Feeds from './Component/Feeds';
import Login from './Component/Login';
import SignUp from './Component/SignUp';
import Profile from './Component/Profile';
import AllVideo from './Component/AllVideo';
import AllImage from './Component/AllImage';
import {BrowserRouter as Router,Switch,Route, Redirect} from "react-router-dom";
import {AuthContext,AuthProvider} from "./Context/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header/>
          <Switch>
            <Route path="/signup" exact component={SignUp}></Route>
            <Route path="/login" exact component={Login}></Route>
            <Route path="/image" exact component={AllImage}></Route>
            <Route path="/video" exact component={AllVideo}></Route>
            <PrivateRoute path="/profile"  comp={Profile}></PrivateRoute>
            <PrivateRoute path="/"  comp={Feeds}></PrivateRoute>
            
            
            
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

function PrivateRoute(props){
  let{comp:Component,path}=props;
  let {currentUser}= useContext(AuthContext);
  // currentUser=true;
  return currentUser?(<Route path={path}  component={Component}></Route>):(<Redirect to="/login"></Redirect>);
  
}

export default App;
