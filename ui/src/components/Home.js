import React from 'react';
import './Home.css';
import InputField from './InputField.js';
import queryString from 'query-string';
import Confirmation from './Confirmation.js';

class Home extends React.Component {

  constructor(props) {
    super(props);
    console.log(props);
    const query = this.props.location.search;
    const params = queryString.parse(query);
    this.state = {page: params.page, params: params};

    this.renderSwitch = this.renderSwitch.bind(this);

  }

  render() {
    return(this.renderSwitch());
  }

  renderSwitch() {
    switch(this.state.page) {
      case 'confirmation':
        return (<div><Confirmation params={this.state.params} /></div>);

      default:
        return (
      <div className="App">
        <header className="logo">
          <h1>Librilisten</h1>
        </header>

        <p className="regular-text">
          Welcome to LibriListen! Navigate to https://librivox.org/search/ and pick out a book. Enter it below to generate a scheduled podcast feed.
        </p>

        <InputField initialText="Libriox Title" />
      </div>    
    );  
    }
  }
}
export default Home;