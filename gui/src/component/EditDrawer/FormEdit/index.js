import React, { Component } from 'react';
import { Button, Divider, message, Form, Input, Select, Drawer } from 'antd';
import './index.css';

const Option = Select.Option;
const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
};

class FormEdit extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        const { form, onClose } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                const { layoutColumn } = values;
                const lcNum = +layoutColumn;
                let colSpanTotal = 0;
                const configs = {
                    layoutColumn,
                    colSpanArr: [],
                };
                for (let i = 0; i < lcNum; i++) {
                    const colSpan = +values[`colSpan-${i}`];
                    colSpanTotal += colSpan;
                    configs.colSpanArr.push(colSpan);
                }
                if (colSpanTotal > 24) {
                    message.error('跨列总数不能超过24!');
                    return;
                }
                onClose(configs);
            }
        });
    }
    renderColSpanInputs() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const layoutColumn = +form.getFieldValue('layoutColumn');
        const componentArr = [];
        for (let i = 0; i < layoutColumn; i++) {
            componentArr.push(
                <Form.Item
                    key={`formitem-${i}`}
                    label={`第${i+1}列`}
                    {...formItemLayout}
                >
                    {getFieldDecorator(`colSpan-${i}`, {
                        initialValue: 24 / layoutColumn,
                        rules: [
                            { required: true, message: '请输入列宽!' },
                            { pattern: /^[1-9](\d)?$/, message: '只能包含数字！' }
                        ],
                    })(
                        <Input />
                    )}
                </Form.Item>
            );
        }
        return componentArr;
    }
    render() {
        const { visible, form, onClose } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Drawer
                visible={visible}
                width={420}
                title="编辑列"
                onClose={() => {
                    onClose(0);
                }}
            >
                <Form
                    onSubmit={this.handleSubmit}
                    style={{ padding: '0 20px' }}
                >
                    <Form.Item
                        label="表单列"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('layoutColumn', {
                            initialValue: 3,
                            rules: [
                                { required: true, message: '请选择列数!' },
                            ],
                        })(
                            <Select>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>
                                <Option value="4">4</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Divider />
                    {
                        this.renderColSpanInputs()
                    }
                    <div className="btn-box">
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ textAlign: 'center' }}
                        >
                            确定
                        </Button>
                    </div>
                </Form>
            </Drawer>
        );
    }
}

export default Form.create()(FormEdit);