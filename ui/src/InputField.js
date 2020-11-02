import React, {Component} from 'react';
import {TextField, Button, Select, MenuItem} from '@material-ui/core';
import {ReactDOM, Redirect} from 'react-dom';

class InputField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.initialText,
      redirect: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    this.setRedirect();
  }

  setRedirect() {
    this.setState({
      redirect: true
    })
  }

  renderRedirect() {
    if(this.state.redirect) {
      return <Redirect to='/about' />
    }
  }

  render() {

  const age = "hello";

  const handleChange = (event) => {
  	this.setState({value: event.target.value});
  };


    return (
    <div>
      {this.renderRedirect()}
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
      <Button variant="outlined" onClick = {() => alert("HELLO")} color="primary">
  Submit
</Button>
      </div>
    );
  }
}
export default InputField