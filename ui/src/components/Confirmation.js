import React from 'react';
import queryString from 'query-string';
import axios from 'axios';
 
class Confirmation extends React.Component {

	constructor(props) {
		super(props);
		console.log(props);
		const query = this.props.location.search;
		const params = queryString.parse(query);
		this.state = {podcastId: params.podcastId};

		this.getSecretEditCode();

	}

	getSecretEditCode() {
		axios.get('http://localhost:21257/secretEditCode',
	    {
	      method: 'GET',
	      headers: {
	        'Access-Control-Allow-Origin': 'http://localhost:3000/'
	      }
	    })
	    .then(response => {
	      console.log(response);
	      this.setState({
	        secretEditCode: response.data.secretEditCode
	      });
    	});
	}

    render() {

    	const podcastLink = "http://librivox.org/podcast/" + this.state.podcastId + ".xml";
    	const secretLink = "localhost:3000/edit?code=" + this.state.secretEditCode;

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
	        	<a href={podcastLink}>{podcastLink}</a>

	        </p>

	        <p className="regular-text">
	        	Unique edit link (keep this secret!):
	        	<br/>
	        	<a href={secretLink}>{secretLink}</a>

	        </p>

    	</div>
    );
    }
}
 
export default Confirmation;