/**
 * @desc 编辑表单项弹窗
 */

import React, { Component } from 'react';
import { Button, Input, Form, Modal } from 'antd';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

class EditFormItemModal extends Component {
	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
		this.onAfterClose = this.onAfterClose.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.visible !== nextProps.visible && nextProps.visible) {
			const { type, colIndex, colSpan, ...values } = nextProps.config;
			this.props.form.setFieldsValue(values);
		}
	}
	onSubmit(e) {
		e.preventDefault();
		e.stopPropagation();
		const { form, onEdit, config, onCancel } = this.props;
		form.validateFields((err, values) => {
	        if (!err) {
	        	const { kIndex } = config;
	          	onEdit({ kIndex, ...values });
	          	onCancel();
	        }
	      },
	    );
	}
	onAfterClose() {
		this.props.form.resetFields();
	}
	render() {
		const { visible, form, onCancel, onDelete } = this.props;
		const { getFieldDecorator } = form;
		return (
			<Modal
				visible={visible}
				title="编辑"
				footer={null}
				onCancel={onCancel}
				afterClose={this.onAfterClose}
				width={300}
			>
				<Form onSubmit={this.onSubmit}>
				    <Form.Item {...formItemLayout} label="label">
			          {getFieldDecorator('label')(
			            <Input />
			          )}
			        </Form.Item>
			        <Form.Item {...formItemLayout} label="name">
			          {getFieldDecorator('name')(
			            <Input />
			          )}
			        </Form.Item>
			        <Form.Item {...formItemLayout} label="placeholder">
			          {getFieldDecorator('placeholder')(
			            <Input />
			          )}
			        </Form.Item>
			        <Form.Item style={{ textAlign: 'center' }}>
			          <Button type="primary" htmlType="submit">
			            保存
			          </Button>
			          <Button style={{ marginLeft: '10px' }} onClick={onDelete}>
			            删除
			          </Button>
			        </Form.Item>
		    	</Form>
	    	</Modal>
	    );
	}
}

export default Form.create()(EditFormItemModal);