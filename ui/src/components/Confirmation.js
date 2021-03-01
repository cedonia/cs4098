import React from 'react';
import queryString from 'query-string';
import {Button} from '@material-ui/core';
import InputField from './InputField.js';
 
class Confirmation extends React.Component {

	constructor(props) {
		super(props);
		console.log(props);

		try {
			const params = this.props.params;
            console.log("PARAMS URL: " + params.url_rss); 
			this.state = {url_rss: params.url_rss, secret_edit_link: params.secret_edit_link};
		}

		catch(e) {
			console.log("PROPS: ");
			console.log(this.props);
			this.state={url_rss: this.props.params.url_rss, secret_edit_link: this.props.params.secret_edit_link};
			console.log(e);
		}

		this.state = {redirect: false};

		this.handleSubmit = this.handleSubmit.bind(this);
		

	}

	handleSubmit(event) {

		this.setState({redirect: true});
	}

    render() {

    	if(this.state.redirect) {
    		return(<InputField initialText="Libriox Title" /> );
    	}

    	const podcastLink = decodeURIComponent(this.state.url_rss);
    	const secretLink = decodeURIComponent(this.state.secret_edit_link);

    	return (
    	<div className="App">
	     	<header className = "logo">
	        	<h1>LibriListen</h1>
	     	</header>

	     	<p className="regular-text">
	        	You have successfully generated a podcast feed.
	        </p>

	        <p className="regular-text">
	        	Podcast link (share with your book group!):
	        	<br/>
	        	<a target="_blank" href={podcastLink}>{podcastLink}</a>

	        </p>

	        <p className="regular-text">
	        	Unique edit link (keep this secret!):
	        	<br/>
	        	<a target="_blank" href={secretLink}>{secretLink}</a>

	        </p>

	        <Button variant="outlined" onClick = {() => this.handleSubmit("hello")} color="primary">
	        Restart
	        </Button>

    	</div>
    );
    }
}
 
export default Confirmation;
