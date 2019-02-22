/**
 * @desc 可拖拽组件抽象类
 */
import React, { PureComponent } from 'react';

class Dragable extends PureComponent {
	onDragStart(e, data) {
		e.dataTransfer.setData('text/plain',JSON.stringify(data));
	}
	render() {
		const { ch, data } = this.props;
		return (
			<span
				draggable="true"
				className="drag-item"
				onDragStart={(e) => { this.onDragStart(e, data); }}
			>
				{ch}
			</span>
		);
	}
}

export default Dragable;