import React from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import MyProfile from 'routes/MyProfile';
import Profile from 'routes/Profile';
import Footer from './Footer';
import Navigation from './Navigation';

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
  return(
    <Router>
      <div style={{display: "flex", justifyContent: "center" , alignItems:"stretch", margin: "0 auto"}}>
        {isLoggedIn && <Navigation userObj={userObj}/>}
        <Switch>
          {isLoggedIn ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <div
              style={{
                width: "600px",
                display: "flex",
                height: "100%",
                flex:"1",
                minHeight:"100vh",
                justifyContent: "center",
                borderLeft: "1px solid #ddd",
                borderRight: "1px solid #ddd",
              }}
              >
                <Route exact path="/">
                  <Home userObj={userObj}/>
                </Route>
                <Route exact path="/profile">
                  <Profile userObj={userObj} refreshUser={refreshUser}/>
                </Route>
                <Route exact path="/myprofile">
                  <MyProfile userObj={userObj} />
                </Route>
              </div>
            </div>  
          ) : (
            <Route exact path="/">
              <Auth />
            </Route>
          )}
        </Switch>
        {isLoggedIn && <Footer />}
      </div>
    </Router>
  );
}

export default AppRouter;