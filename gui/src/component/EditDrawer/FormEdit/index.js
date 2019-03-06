import React, { Component } from 'react';
import { Button, Divider, message, Form, Input, Select, Drawer } from 'antd';
import formItemLayout from '../../configs/layout';
import './index.css';

const Option = Select.Option;

class FormEdit extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(value) {
        const colSpanValues = {};
        const val = 24 / value;
        for(let i = 0; i < value; i++) {
            colSpanValues[`colSpan-${i}`] = val;
        }
        setTimeout(() => {
            this.props.form.setFieldsValue(colSpanValues);
        }, 0);
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
        const { visible, form, onClose, onDeleteContainer } = this.props;
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
                            <Select onChange={this.handleChange}>
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
                            style={{ marginRight: '10px' }}
                        >
                            确定
                        </Button>
                        <Button onClick={onDeleteContainer}>删除容器</Button>
                    </div>
                </Form>
            </Drawer>
        );
    }
}

export default Form.create()(FormEdit);