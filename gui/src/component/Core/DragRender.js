import React, { Component, Fragment } from 'react';
import { Form, Col } from 'antd';
import renderComponent, { renderExpandBtn } from '../../component/common/RenderUtil';
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
                const { expand, onCollapse } = this.props;
                itemComponent = renderExpandBtn(itemConfig, expand, onCollapse);
                break;
            default:
                itemComponent =renderComponent(itemConfig);
                break;
        }
        return itemComponent;
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