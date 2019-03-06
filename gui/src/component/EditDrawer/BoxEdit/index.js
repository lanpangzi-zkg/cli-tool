import React, { Component } from 'react';
import { Button, Form, Input, Icon, Select, Drawer } from 'antd';
import  { objToStr, strToObj } from '../../common/CellUtil';
import formItemLayout from '../../configs/layout';
import './index.css';

const TextArea = Input.TextArea;
const Option = Select.Option;

class BoxEdit extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        const { form, onClose } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                const { layoutColumn, boxStyles } = values;
                const configs = {
                    layoutColumn,
                    boxStyles: strToObj(boxStyles),
                };
                onClose(configs);
            }
        });
    }
    render() {
        const { visible, form, onClose, configs ={}, onDeleteContainer } = this.props;
        const { boxStyles = {}, layoutColumn = 3 } = configs;
        const initialBoxStyles = objToStr(boxStyles);
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
                        label="style设置"
                        {...formItemLayout}
                    >
						{form.getFieldDecorator("boxStyles", {
							initialValue: initialBoxStyles,
						})(
							<TextArea placeholder="多个样式属性请用分号分隔" />
						)}
					</Form.Item>
                    <Form.Item
                        label="容器列"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('layoutColumn', {
                            initialValue: layoutColumn,
                            rules: [
                                { required: true, message: '请选择列数!' },
                            ],
                        })(
                            <Select>
                                <Option value="1">1</Option>
                                <Option value="2">2</Option>
                                <Option value="3">3</Option>
                                <Option value="4">4</Option>
                                <Option value="5">5</Option>
                                <Option value="6">6</Option>
                                <Option value="7">7</Option>
                                <Option value="8">8</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <div className="tips-box">
                        <Icon type="info-circle" />box容器只能存放Text,Tabs,Button及Breadcrumb组件.
                    </div>
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

export default Form.create()(BoxEdit);