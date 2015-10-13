import React from 'react';

class PresenterDetails extends React.Component {
	constructor(props) {
		super(props);
	}

	render () {
		return (
			<div className="PresentationUpperBanner PresentationDetails">
	            <div className="Step">
	            	<div className='Step-number'>1</div>
	            	<div className='Step-instructions'>
	            		<div className='Step-label'>Go to</div>
	            		<div className='Step-value'>artifex.uqcloud.net</div>
	            	</div>
	            </div>
	            <div className="Step">
	            	<div className='Step-number'>2</div>
	            	<div className='Step-instructions'>
	            		<div className='Step-label'>Enter code</div>
	            		<div className='Step-value'>{this.props.code}</div>
	              </div>
	            </div>
	        </div>
        );
	}
}

export default PresenterDetails;