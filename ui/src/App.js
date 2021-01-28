import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import queryString from 'query-string';
 
import Home from './components/Home';
import About from './components/About';
import Error from './components/Error';
import Navigation from './components/Navigation';
import Confirmation from './components/Confirmation';
 
class App extends React.Component {

  render() {
    console.log("HELLO");

    return (      
       <BrowserRouter>
          <Navigation />
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/about" exact component={About}/>
            <Route path="/confirmation" exact component={Confirmation}/>
            <Route component={Error}/>
          </Switch>
      </BrowserRouter>
    );
  }
}
 
export default App;