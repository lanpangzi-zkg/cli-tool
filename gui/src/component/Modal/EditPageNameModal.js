import React, { Component } from 'react';
import { Button, Form, Input, Modal } from 'antd';

class EditPageNameModal extends Component {
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
        return (
            <Modal
                visible={showModal}
                footer={null}
                width={250}
                closable={false}
                title="编辑页面名称"
                maskClosable={false}
            >
                <Form
                    onSubmit={this.handleSubmit}
                    style={{ padding: '0 20px' }}
                >
                    <Form.Item>
                    {getFieldDecorator('pageName', {
                        rules: [
                            { required: true, message: '请输入页面名称!' },
                            { pattern: /^[a-zA-Z]+$/, message: '名称只能包含字母！' }
                        ],
                    })(
                        <Input placeholder="页面名称" />
                    )}
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ width: '100%' }}
                        >
                            确定
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(EditPageNameModal);