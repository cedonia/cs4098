import React, {Component} from 'react';
import {TextField, Button, Select, MenuItem} from '@material-ui/core';
import {ReactDOM, Redirect, Router, withRouter, useHistory, NavLink} from 'react-dom';
import About from './About';
import axios from 'axios';

class InputField extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      value: this.props.initialText,
      redirect: false,
      podcastId: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {

    axios.get('http://localhost:21257/GenPodcast',
    {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000/'
      }
    }
    )
    .then(response => {
      console.log(response);
      this.setState({
        redirect: true,
        podcastId: response.data.id
      });
    });
  }

  render() {

    const age = 10;

    if(this.state.redirect) {
      window.location="http://localhost:3000/confirmation?podcastId=" + this.state.podcastId;
      //todo fix
    }

    //todo verify it's a valid link

    return (
    <div>
      <TextField id="standard-basic" label="Librivox link" required = {true}/>
      <br/>
      <br/>
      <p> How often do you want a new chapter?</p>
      <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={age}
          onChange={this.handleChange}
          autoWidth
        >
          <MenuItem value={10}>Daily</MenuItem>
          <MenuItem value={20}>Every Other Day</MenuItem>
          <MenuItem value={30}>Weekly</MenuItem>
        </Select>
      <br/>
      <br/>
      <br/>
      <Button variant="outlined" onClick = {() => this.handleSubmit("hello")} color="primary">
  Submit
</Button>
      </div>
    );
  }
}
export default InputField