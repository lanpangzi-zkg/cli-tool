import React, { Component } from 'react';
import { Button, Form, Input } from 'antd';
import './index.css';

class EditPageName extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        const { form, onCloseModal } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
              onCloseModal(values);
            }
        });
    }
    render() {
        const { showModal, form } = this.props;
        const { getFieldDecorator } = form;
        if (!showModal) {
            return null;
        }
        return (
            <div className="edit-name-box">
                <Form
                    onSubmit={this.handleSubmit}
                    style={{ padding: '0 20px' }}
                >
                    <Form.Item>
                        <h3 className="title">页面名称</h3>
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('pageName', {
                            rules: [
                                { required: true, message: '请输入页面名称!' },
                                { pattern: /^[a-zA-Z]+$/, message: '名称只能包含字母！' }
                            ],
                        })(
                            <Input placeholder="只能包含字母" />
                        )}
                    </Form.Item>
                    <Form.Item  style={{ marginTop: '15px' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ width: '100%' }}
                        >
                            确定
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default Form.create()(EditPageName);