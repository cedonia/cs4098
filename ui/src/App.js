import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import queryString from 'query-string';
 
import Home from './components/Home';
import About from './components/About';
import Error from './components/Error';
import Confirmation from './components/Confirmation';
 
class App extends React.Component {

  render() {
    return (      
       <BrowserRouter>
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/about" exact component={About}/>
            <Route path="/confirmation" exact component={Confirmation}/>
            <Redirect from="/build/index.html" to="/"/>
            <Route component={Error}/>
          </Switch>
      </BrowserRouter>
    );
  }
}
 
export default App;