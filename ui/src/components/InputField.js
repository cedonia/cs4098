import React from 'react';
import {TextField, Button, Select, MenuItem} from '@material-ui/core';
import axios from 'axios';
import Confirmation from './Confirmation.js';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

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
  handleSubmit() {

    axios.get(this.apiLink + '/api/GenPodcast/title/' + encodeURIComponent(this.state.title) + '?mon=' + this.state.mon + '&tues=' + this.state.tues + '&wed=' + this.state.wed + '&thurs=' + this.state.thurs + '&fri=' + this.state.fri + '&sat=' + this.state.sat + '&sun=' this.state.sun)
    .then(response => {
      console.log(response);
      this.setState({
        redirect: true,
        url_rss: response.data.url_rss,
        secret_edit_link: response.data.secret_edit_link
      });
    });
  }

  const greenCheckbox = withStyles({
    root: {
      color: green[400],
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((props) => <Checkbox color="default" {...props} />);

  render() {

    const age = 10;

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
      <FormGroup row>
        <FormControlLabel
          control={<Checkbox checked={state.mon} onChange={handleMonChange} name="Monday" color="primary"/>}
          label = "Monday"
        />
        <FormControlLabel
          control={<Checkbox checked={state.tues} onChange={handleTuesChange} name="Tuesday" color="primary" />}
          label = "Tuesday"
        />
        <FormControlLabel
          control={<Checkbox checked={state.wed} onChange={handleWedChange} name="Wednesday" color="primary" />}
          label = "Wednesday"
        />
        <FormControlLabel
          control={<Checkbox checked={state.thurs} onChange={handleThursChange} name="Thursday" color="primary" />}
          label = "Thursday"
        />
        <FormControlLabel
          control={<Checkbox checked={state.fri} onChange={handleFriChange} name="Friday" color="primary" />}
          label = "Friday"
        />
        <FormControlLabel
          control={<Checkbox checked={state.sat} onChange={handleSatChange} name="Saturday" color="primary" />}
          label = "Saturday"
        />
        <FormControlLabel
          control={<Checkbox checked={state.sun} onChange={handleSunChange} name="Sunday" color="primary" />}
          label = "Sunday"
        />
      </FormGroup>  

      <br/>
      <br/>
      <br/>
      <Button variant="outlined" onClick = {() => this.handleSubmit()} color="primary">
  Submit
</Button>
      </div>
      </div>
    );
  }
}
export default InputField
