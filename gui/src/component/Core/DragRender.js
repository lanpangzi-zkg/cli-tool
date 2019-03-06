import React, { Component, Fragment } from 'react';
import { Button, Icon, Form, Col } from 'antd';
import renderComponent from '../../component/common/RenderUtil';
import { TRUE } from '../common/Constants';
import moment  from 'moment';

class DragRender extends Component {
	renderItem = (itemConfig) => {
        const { type = 'Input' } = itemConfig;
        let itemComponent = null;
        switch(type) {
            case 'Select':
            case 'RangePicker':
            case 'DatePicker':
            case 'Radio':
            case 'Checkbox':
            case 'Input':
                itemComponent =renderComponent(itemConfig);
                break;
            case 'Btn':
                itemComponent = this.renderBtn(itemConfig);
                break;
            default:
                itemComponent =renderComponent(itemConfig);
                break;
        }
        return itemComponent;
    }
    renderBtn = (itemConfig) => {
        const { btnArr } = itemConfig;
        return (
            <Fragment>
                {
                    btnArr.map((btn) => {
                        const { btnText = 'button', expandFlag, expandCount,
                            style = {}, index, ...btnProps } = btn;
                        if (expandFlag === TRUE) {
                            const { expand, onCollapse } = this.props;
                            const collapseBtnText = expand ? '隐藏' : '展开';
                            return (
                                <a
                                    className="btn-collapse"
                                    onClick={onCollapse}
                                    href="&nbsp;"
                                    key={`btn-${index}`}
                                    style={style}
                                >
                                    {collapseBtnText}
                                    <Icon type={expand ? 'up' : 'down'} />
                                </a>
                                );
                        }
                        return (
                            <Button
                                key={`btn-${index}`}
                                style={style}
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
        const { type, colSpan, label, name, rules, cellStyles = {}, hasLinkage } = formItemConfig;
        const md = colSpan || 8;
        if (!name && type !== 'Btn') {
            return null;
        }
        // 联动显示控制
        if (hasLinkage === '1') {
            const { linkName, condition } = formItemConfig;
            if (form.getFieldValue(linkName) !== condition) {
                return null;
            }
        }
		return (
			<Fragment>
				<Col
			        span={colSpan}
			        md={md} sm={24}
			    >
                    {
                        type !== 'Btn' ?
                            (
                                <Form.Item label={label} style={cellStyles}>
                                    {getFieldDecorator(name, {
                                        rules: rules || [],
                                        initialValue: this.getInitialValue(formItemConfig),
                                    })(
                                        this.renderItem(formItemConfig)
                                    )}
                                </Form.Item>
                            ) : (
                                <Form.Item style={cellStyles}>
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

export default DragRender;