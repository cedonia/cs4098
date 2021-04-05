import React from 'react';
import {Button} from '@material-ui/core';
import Home from './Home.js';
 
class Confirmation extends React.Component {

	constructor(props) {
		super(props);

		try {
			const params = this.props.params;
			this.state = {
				url_rss: decodeURIComponent(params.url_rss), 
				secret_edit_link: decodeURIComponent(params.secret_edit_link),
				redirect: false
			};
		}

		catch(e) {
			this.state={
				url_rss: this.props.params.url_rss, 
				secret_edit_link: this.props.params.secret_edit_link,
				redirect: false
			};
		}

		this.handleSubmit = this.handleSubmit.bind(this);
		

	}

    render() {

    	if(this.state.redirect) {
    		return(<Home /> );
    	}

    	const podcastLink = this.state.url_rss;
    	const secretLink = this.state.secret_edit_link;

    	return (
	    	<div className="App">
		     	<div>
		          <div className="logo-top">Librilisten</div>
		          <div className="logo-bottom">Turn your next read into a customized podcast, with new chapters only when <i>you</i> want them.</div>
		        </div>

		     	<p>
		        	You have successfully generated a podcast feed.
		        </p>

		        <p>
		        	Podcast link (share with your book group!):
		        	<br/>
		        	<a target="_blank" href={podcastLink}>{podcastLink}</a>

		        </p>

		        <p>
		        	Unique edit link (keep this secret!):
		        	<br/>
		        	<a target="_blank" href={secretLink}>{secretLink}</a>

		        </p>

		        <Button variant="outlined" onClick = {() => this.setState({redirect: true})} color="primary">
		        	Restart
		        </Button>

	    	</div>
    );
    }
}
 
export default Confirmation;
