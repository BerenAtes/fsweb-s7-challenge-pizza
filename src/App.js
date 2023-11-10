import React, { useEffect } from "react";
import Header from "./Layout/Header";
import "./App.css";
import OrderForm from "./Pages/OrderForm";
import { useState } from "react";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import Home from "./Pages/Home";
import Success from "./Pages/Success";

const App = () => {
  const [order, setOrder] = useState([]);

  const handleOrder = (order) => {
    setOrder(order);
  };

  useEffect(() => {
    console.log("order", order);
  }, [order]);

  function handleSubmit(formData) {
    console.log(formData);
  }

  return (
    <div className="app">
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/pizza">
          <Header />
          <OrderForm handleOrder={handleOrder} handleSubmit={handleSubmit} />
        </Route>
        <Route exact path="/success">
          <Success />
        </Route>
      </Switch>
    </div>
  );
};
export default App;
