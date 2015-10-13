import React from 'react';

class PresenterActivate extends React.Component {
	constructor(props) {
		super(props);
	}

	render () {
		return (
			<div className="PresentationUpperBanner PresentationActivate" onClick={this.props.activateLecture}>
				<span> This lecture is in PREVIEW MODE. Click this banner to activate. </span>
	        </div>
        );
	}
}

export default PresenterActivate;