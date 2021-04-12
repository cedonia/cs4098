import React from 'react';
import {TextField, Button} from '@material-ui/core';
import axios from 'axios';
import Confirmation from './Confirmation.js';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
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


  /**
  When the submit button is clicked, query the API with the user's inputs. 
  Then store the returned values to be sent to the Confirmation page.
  **/
  handleSubmit(event) {

    //If no days have been selected, do not submit the page.
    if(this.state.mon === false && this.state.tues === false && this.state.wed === false && this.state.thurs === false
      && this.state.fri === false && this.state.sat === false && this.state.sun === false) {
      console.log("User must select at least one day.");
      return;
    }

    //Example URI: https://cmp24.host.cs.st-andrews.ac.uk/api/GenPodcast/title/autumn?mon=false&tues=false&wed=false&thurs=false&fri=false&sat=false&sun=true
    var uri = this.apiLink + '/api/GenPodcast/title/' + encodeURIComponent(this.state.title) + 
      '?mon=' + this.state.mon + 
      '&tues=' + this.state.tues + 
      '&wed=' + this.state.wed + 
      '&thurs=' + this.state.thurs + 
      '&fri=' + this.state.fri + 
      '&sat=' + this.state.sat + 
      '&sun=' + this.state.sun;
    
    axios.get(uri)
    .then(response => {

      //Don't move forward if there is an API error
      if(response.status != 200) {
        console.log("There has been an error with the API.");
        return;
      }

      this.setState({
        redirect: true,
        url_rss: response.data.url_rss,
        secret_edit_link: response.data.secret_edit_link
      });
    });
  }

  render() {

    if(this.state.redirect) {
      return(
        <Confirmation params={{
          url_rss: encodeURIComponent(this.uiLink + '/podcasts/' + this.state.url_rss + '.rss'), 
          secret_edit_code: encodeURIComponent(this.state.secret_edit_link)
        }}/>
      );
    }

    return (

      <div className="App">
        <div>
          <div className="logo-top">Librilisten</div>
          <div className="logo-bottom">Turn your next read into a customized podcast, with new chapters only when <i>you</i> want them.</div>
        </div>

        <p className="regular-text">
          <br/>
          <br/>
          1. Go to <a href="https://librivox.org/search/" target="_blank">Librivox</a> and onto the page of the book you want.
          <br/>
          2. Paste its title (without the author!) into the form below.
          <br/>
          3. Choose which days you want a new chapter to be published
          <br/>
          4. Click "submit" to get the link to your new podcast
        </p>
      <div>
        <TextField id="standard-basic" onChange={this.handleTitleChange} label="Librivox Title" required = {true}/>
        <br/>
        <br/>
        <br/>
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

        <Button variant="outlined" onClick = {this.handleSubmit} color="primary">
          Submit
        </Button>

        </div>
      </div>
    );
  }
}
export default Home
