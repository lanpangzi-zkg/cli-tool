import React, { Component } from 'react';
import { Button, Form, Input, Modal } from 'antd';

class EditLayoutColumnModal extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        const { form, onCloseModal } = this.props;
        form.validateFields((err, { layoutColumn }) => {
            if (!err) {
              onCloseModal(layoutColumn);
            }
        });
    }
    render() {
        const { showModal, form, onCloseModal } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={showModal}
                footer={null}
                width={250}
                title="编辑列"
                maskClosable
                onCancel={onCloseModal}
            >
                <Form
                    onSubmit={this.handleSubmit}
                    style={{ padding: '0 20px' }}
                >
                    <Form.Item>
                    {getFieldDecorator('layoutColumn', {
                        rules: [
                            { required: true, message: '请输入列数!' },
                            { pattern: /^[1-9]$/, message: '名称只能包含数字！' }
                        ],
                    })(
                        <Input placeholder="列数" />
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

export default Form.create()(EditLayoutColumnModal);