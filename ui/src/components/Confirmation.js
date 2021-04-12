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
				secret_edit_code: decodeURIComponent(params.secret_edit_code),
				redirect: false
			};
		}

		catch(e) {
			this.state={
				url_rss: this.props.params.url_rss, 
				secret_edit_code: this.props.params.secret_edit_code,
				redirect: false
			};
		}		

	}

    render() {

    	if(this.state.redirect) {
    		return(<Home /> );
    	}

    	const podcastLink = this.state.url_rss;

    	return (
	    	<div className="App">
		     	<div>
		          <div className="logo-top">Librilisten</div>
		          <div className="logo-bottom">Turn your next read into a customized podcast, with new chapters only when <i>you</i> want them.</div>
		        </div>

		        <br/>
		     	<p>
		        	You have successfully generated a podcast feed! 
		        	<br/>
		        	Click <a target="_blank" href="https://docs.google.com/document/d/1ZsmgUx1urZqp-Om2q0z9MRi48TO4YlAX56OipzBn-ho/edit?usp=sharing">here</a> for instructions to subscribe on the podcast app of your choice.

		        </p>
		        <p>
		        	Podcast link (share with anyone who will be reading along with you!):
		        	<br/>
		        	<a target="_blank" href={podcastLink}>{podcastLink}</a>

		        </p>

		        <p>
		        	Unique edit code (store this and keep it secret!):
		        	<br/>
		        	{this.state.secret_edit_code}

		        </p>

		        <br/>

		        <Button variant="outlined" onClick = {() => this.setState({redirect: true})} color="primary">
		        	Restart
		        </Button>

	    	</div>
    );
    }
}
 
export default Confirmation;
