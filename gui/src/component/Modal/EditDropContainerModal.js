import React, { Component } from 'react';
import { Button, Form, Modal, Select } from 'antd';
const { Option } = Select;

class EditDropContainerModal extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        const { form, onCloseModal } = this.props;
        form.validateFields((err, { colSpan }) => {
            if (!err) {
                onCloseModal(colSpan);
            }
        });
    }
    renderColSpanOption() {
        const { layoutColumn } = this.props;
        const optionArr = [];
        const columnOffset = 24 / layoutColumn;
        for (let i = 1; i <= layoutColumn; i++) {
            optionArr.push(<Option key={`colspan-${i}`} value={i * columnOffset}>{i}</Option>);
        }   
        return optionArr;
    }
    render() {
        const { showModal, form, onCloseModal, onDelete } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={showModal}
                footer={null}
                width={250}
                title="编辑"
                onCancel={onCloseModal}
            >
                <Form
                    onSubmit={this.handleSubmit}
                    style={{ padding: '0 20px' }}
                >
                    <Form.Item>
                    {getFieldDecorator('colSpan', {
                        rules: [
                            { required: true, message: '请选择跨列数!' },
                        ],
                    })(
                        <Select>
                            {
                                this.renderColSpanOption()
                            }
                        </Select>
                    )}
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            确定
                        </Button>
                        {/* <Button
                            style={{ marginLeft: '10px' }}
                            onClick={onDelete}
                        >
                            删除
                        </Button> */}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(EditDropContainerModal);