import React, {Component} from 'react';
import {TextField, Button, Select, MenuItem} from '@material-ui/core';
import ReactDOM from 'react-dom';

class InputField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.initialText
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('The button was clicked: ' + this.state.value);
  }

  render() {

  const age = "hello";

  const handleChange = (event) => {
  	this.setState({value: event.target.value});
  };


    return (
    <div>
      <TextField id="standard-basic" label="Librivox link" required = "true"/>
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