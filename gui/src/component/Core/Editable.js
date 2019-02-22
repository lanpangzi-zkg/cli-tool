import React, { Component, Fragment } from 'react';
import { Button, Input, Form, Col, Select, DatePicker } from 'antd';
import moment  from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;  

class Editable extends Component {
	getType() {
		return '';
	}
	constructor(props) {
		super(props);
		this.state = {
			editable: false, //可编辑标识
		};
		this.onEditToggle = this.onEditToggle.bind(this);
	}
	onEditToggle(e) {
        e && e.stopPropagation();
		const { editable } = this.state;
		this.setState({
			editable: !editable,
		});
	}
	renderItem = (itemConfig) => {
        const { placeholder, type = 'Input' } = itemConfig;
        let itemComponent = null;
        switch(type) {
            case 'Select':
                itemComponent = this.renderSelect(itemConfig);
                break;
            case 'RangePicker':
                itemComponent = this.renderRangePicker(itemConfig);
                break;
            case 'DatePicker':
                itemComponent = this.renderDatePicker(itemConfig);
                break;
            case 'Btn':
                itemComponent = this.renderBtn(itemConfig);
                break;
            default:
                itemComponent = (<Input placeholder={placeholder} />);
                break;
        }
        return itemComponent;
    }
    renderSelect = (selectConfig) => {
        const { style = {}, options = [] } = selectConfig;
        return (
            <Select style={{ width: '100%', ...style }}>
                {
                    Array.isArray(options) ? options.map(({ key, optionValue, optionText }) => {
                        return (
                            <Option
                                key={key || optionValue}
                                value={optionValue}
                            >
                                {optionText}
                            </Option>
                        );
                    }) : null
                }
            </Select>
        );
    }

    renderDatePicker = () => {
        return (
            <DatePicker style={{ width: '100%' }} />
        );
    }

    renderRangePicker = () => {
        return (
            <RangePicker style={{ width: '100%' }} />
        );
    }

    renderBtn = (itemConfig) => {
        const { btnArr } = itemConfig;
        // const fnName = newBtnProps.clickfncname;
        // if (typeof this.props[fnName] === 'function') {
        //     newBtnProps.onClick = this.props[fnName];
        // }
        return (
            <Fragment>
                {
                    btnArr.map((btn) => {
                        const { btnText = 'button', index, ...btnProps } = btn;
                        return (
                            <Button
                                key={`btn-${index}`}
                                {...btnProps}
                            >
                                {btnText}
                            </Button>
                        );
                    })
                }
            </Fragment>
        );
    }

    getInitialValue(formItemConfig) {
        const { type = 'Input', defaultValue } = formItemConfig;
        if (type === 'DatePicker' || type === 'RangePicker') {
            return defaultValue && moment(defaultValue, 'YYYY-MM-DD');
        }
        return formItemConfig.defaultValue || '';
    }

	render() {
        const { formItemConfig = {}, form } =this.props;
        const { getFieldDecorator } = form;
        const { type, colSpan, label, name, rules } = formItemConfig;
        const md = colSpan || 8;
		return (
			<Fragment>
				<Col
			        span={colSpan}
			        md={md} sm={24}
			    >
                    {
                        type !== 'Btn' ?
                            (
                                <Form.Item label={label}>
                                    {getFieldDecorator(name, {
                                        rules: rules || [],
                                        initialValue: this.getInitialValue(formItemConfig),
                                    })(
                                        this.renderItem(formItemConfig)
                                    )}
                                </Form.Item>
                            ) : (
                                <Form.Item>
                                    {
                                        this.renderItem(formItemConfig)
                                    }
                                </Form.Item>
                            )
                    }
			      
			    </Col>
		    </Fragment>
	    );
	}
}

export default Editable;