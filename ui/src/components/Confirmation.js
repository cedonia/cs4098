import React from 'react';
import queryString from 'query-string';
import axios from 'axios';
 
class Confirmation extends React.Component {

	constructor(props) {
		super(props);
		console.log(props);
		const query = this.props.location.search;
		const params = queryString.parse(query);
		this.state = {url_rss: params.url_rss};

		this.getSecretEditCode();

	}

	getSecretEditCode() {
		axios.get('http://localhost:21267/secretEditCode',
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

    	const podcastLink = this.state.url_rss;
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
	        	<a target="_blank" href={podcastLink}>{podcastLink}</a>

	        </p>

	        <p className="regular-text">
	        	Unique edit link (keep this secret!):
	        	<br/>
	        	<a target="_blank" href={secretLink}>{secretLink}</a>

	        </p>

    	</div>
    );
    }
}
 
export default Confirmation;