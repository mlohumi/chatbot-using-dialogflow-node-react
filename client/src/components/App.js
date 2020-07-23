import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Header from "./Header";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Shop from "./shop/Shop";
import Chatbot from "./chatbot/Chatbot";
// import Chatbot1 from './chatbot/Chatbot1';

const App = () => (
  //   <div className="container">
  <BrowserRouter>
    {/* <Header /> */}
    <Route exact path="/" component={Landing} />
    <Route exact path="/about" component={About} />
    <Route exact path="/shop" component={Shop} />
    <Route exact path="/header" component={Header} />
    <Route exact path="/chat" component={Chatbot} />
  </BrowserRouter>
  //   </div>
);

export default App;
