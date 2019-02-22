import React, { PureComponent, Fragment } from 'react';
import Dragable from '../Core/Dragable';
import Config from './Config';

class TargetFactory extends PureComponent {
	render() {
		const { tabType = 'form' } = this.props;
		const targetConfigArr = Config[tabType];
		if (Array.isArray(targetConfigArr)) {
			return (
				<Fragment>
					{
						targetConfigArr.map((config, index) => {
							return (
								<Dragable {...config} key={`drag-${index}`} />
							);
						})
					}
				</Fragment>
			);
		}
		return null;
	}
}

export default TargetFactory;