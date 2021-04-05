import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
 
import Home from './Home';
import About from './About';
import Error from './Error';
import Confirmation from './Confirmation';
 
class App extends React.Component {

  render() {
    return (<InputField initialText="Librivox Title" />);
  }
}
 
export default App;

/****
<BrowserRouter>
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/about" exact component={About}/>
            <Route path="/confirmation" exact component={Confirmation}/>
            <Redirect from="/build/index.html" to="/"/>
            <Route component={Error}/>
          </Switch>
      </BrowserRouter>
      ***/