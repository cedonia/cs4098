import React from 'react';
import InputField from './InputField';
  
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