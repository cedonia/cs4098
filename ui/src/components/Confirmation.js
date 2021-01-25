import React from 'react';
import queryString from 'query-string';
 
class Confirmation extends React.Component {

	constructor(props) {
		super(props);
		console.log(props);
		const query = this.props.location.search;
		const params = queryString.parse(query);
		this.state = {url_rss: params.url_rss, secret_edit_link: params.secret_edit_link};

	}

    render() {

    	const podcastLink = this.state.url_rss;
    	const secretLink = this.state.secret_edit_link;

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