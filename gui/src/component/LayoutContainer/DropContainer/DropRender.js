import React, { PureComponent } from 'react';
import renderComponent from '../../common/RenderUtil';

class DropRender extends PureComponent {
	render() {
		const { dropConfig = {} } =this.props;
		const {cellStyles} = dropConfig;
		return (
			<div style={cellStyles}>
                {
                    renderComponent(dropConfig)
                }
		    </div>
	    );
	}
}

export default DropRender;