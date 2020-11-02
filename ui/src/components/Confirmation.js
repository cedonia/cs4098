import React from 'react';
import queryString from 'query-string';
 
class Confirmation extends React.Component {

	constructor(props) {
		super(props);
		console.log(props);
		const query = this.props.location.search;
		const params = queryString.parse(query);
		this.state = {podcast: params.podcast};

	}

    render() {

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
	        	http://librivox.org/podcast/{this.state.podcast}.xml

	        </p>

	        <p className="regular-text">
	        	Unique edit link (keep this secret!):
	        	<br/>
	        	http://librivox.org/podcast/{this.state.podcast}.xml

	        </p>

    	</div>
    );
    }
}
 
export default Confirmation;