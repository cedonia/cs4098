import React from 'react';
import {TextField, Button} from '@material-ui/core';
import axios from 'axios';
import Confirmation from './Confirmation.js';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

class InputField extends React.Component {

  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      value: this.props.initialText,
      redirect: false,
      podcastId: '',
      mon: false,
      tues: false,
      wed: false,
      thurs: false,
      fri: false,
      sat: false,
      sun: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);

    this.handleMonChange = this.handleMonChange.bind(this);
    this.handleTuesChange = this.handleTuesChange.bind(this);
    this.handleWedChange = this.handleWedChange.bind(this);
    this.handleThursChange = this.handleThursChange.bind(this);
    this.handleFriChange = this.handleFriChange.bind(this);
    this.handleSatChange = this.handleSatChange.bind(this);
    this.handleSunChange = this.handleSunChange.bind(this);

    // this.apiLink = 'http://localhost:21257';
    // this.uiLink = 'http://localhost:3000';
    this.apiLink = "https://cmp24.host.cs.st-andrews.ac.uk";
    this.uiLink = "https://cmp24.host.cs.st-andrews.ac.uk";
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleTitleChange(event) {
    this.setState({title: encodeURIComponent(event.target.value)});
  }

  handleMonChange(event) {
    this.setState({mon: event.target.checked});
  }
  handleTuesChange(event) {
    this.setState({tues: event.target.checked});
  }
  handleWedChange(event) {
    this.setState({wed: event.target.checked});
  }
  handleThursChange(event) {
    this.setState({thurs: event.target.checked});
  }
  handleFriChange(event) {
    this.setState({fri: event.target.checked});
  }
  handleSatChange(event) {
    this.setState({sat: event.target.checked});
  }
  handleSunChange(event) {
    this.setState({sun: event.target.checked});
  }


//https://cmp24.host.cs.st-andrews.ac.uk/api/GenPodcast/title/autumn?mon=false&tues=false&wed=false&thurs=false&fri=false&sat=false&sun=true
  handleSubmit(event) {

    var uri = this.apiLink + '/api/GenPodcast/title/' + encodeURIComponent(this.state.title);
    uri = uri + '?mon=' + this.state.mon + '&tues=' + this.state.tues + '&wed=' + this.state.wed + '&thurs=' + this.state.thurs + '&fri=' + this.state.fri + '&sat=' + this.state.sat + '&sun=' + this.state.sun;

    console.log("URI: " + uri);
    axios.get(uri)
    .then(response => {
      console.log(response);
      this.setState({
        redirect: true,
        url_rss: response.data.url_rss,
        secret_edit_link: response.data.secret_edit_link
      });
    });

    //TODO: don't submit if title undefined, or if no days are selected!
  }

  render() {

    if(this.state.redirect) {
      return(<Confirmation params={{url_rss: encodeURIComponent(this.uiLink + '/podcasts/' + this.state.url_rss + '.rss'), secret_edit_link: encodeURIComponent(this.uiLink + '/edit/' + this.state.secret_edit_link)}} />)
      // window.location= this.uiLink + "?page=confirmation&url_rss=" + encodeURIComponent(this.state.url_rss) + "&secret_edit_link=" + encodeURIComponent(this.state.secret_edit_link);
      //todo fix
    }

    //todo verify it's a valid link

    return (

      <div className="App">
        <header className="logo">
          <h1>Librilisten</h1>
        </header>

        <p className="regular-text">
          Welcome to LibriListen! Navigate to https://librivox.org/search/ and pick out a book. Enter it below to generate a scheduled podcast feed.
        </p>
      <div>
      <TextField id="standard-basic" onChange={this.handleTitleChange} label="Librivox Title" required = {true}/>
      <br/>
      <br/>
      <p> Select the days you want to receive a new chapter.</p>
      <FormGroup row className="Checklist">
        <FormControlLabel
          control={<Checkbox checked={this.state.mon} onChange={this.handleMonChange} name="Monday" color="primary"/>}
          label = "Monday"
        />
        <FormControlLabel
          control={<Checkbox checked={this.state.tues} onChange={this.handleTuesChange} name="Tuesday" color="primary" />}
          label = "Tuesday"
        />
        <FormControlLabel
          control={<Checkbox checked={this.state.wed} onChange={this.handleWedChange} name="Wednesday" color="primary" />}
          label = "Wednesday"
        />
        <FormControlLabel
          control={<Checkbox checked={this.state.thurs} onChange={this.handleThursChange} name="Thursday" color="primary" />}
          label = "Thursday"
        />
        <FormControlLabel
          control={<Checkbox checked={this.state.fri} onChange={this.handleFriChange} name="Friday" color="primary" />}
          label = "Friday"
        />
        <FormControlLabel
          control={<Checkbox checked={this.state.sat} onChange={this.handleSatChange} name="Saturday" color="primary" />}
          label = "Saturday"
        />
        <FormControlLabel
          control={<Checkbox checked={this.state.sun} onChange={this.handleSunChange} name="Sunday" color="primary" />}
          label = "Sunday"
        />
      </FormGroup>  

      <br/>
      <br/>
      <br/>

      <Button variant="outlined" onClick = {() => this.handleSubmit("hello")} color="primary">
        Submit
      </Button>

      </div>
      </div>
    );
  }
}
export default InputField
