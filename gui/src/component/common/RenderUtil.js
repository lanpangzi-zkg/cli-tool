import React, { Fragment } from 'react';
import { Button, Checkbox, Input, Tabs, Select, DatePicker, Breadcrumb, Radio } from 'antd';

const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const renderComponent = (dropConfig) => {
    const { placeholder = '', type = 'Input' } = dropConfig;
    let component = null;
    switch(type) {
        case 'Text':
            component = renderText(dropConfig);
            break;
        case 'Breadcrumb':
            component = renderBreadcrumb(dropConfig);
            break;
        case 'Select':
            component = renderSelect(dropConfig);
            break;
        case 'RangePicker':
            component = renderRangePicker(dropConfig);
            break;
        case 'DatePicker':
            component = renderDatePicker(dropConfig);
            break;
        case 'Radio':
            component = renderRadio(dropConfig);
            break;
        case 'Checkbox':
            component = renderCheckbox(dropConfig);
            break;
        case 'Tabs':
            component = renderTabs(dropConfig);
            break;
        case 'Btn':
            component = renderBtn(dropConfig);
            break;
        default:
            component = (<Input placeholder={placeholder} />);
            break;
    }
    return component;
};
const renderBreadcrumb = (config) => {
    const { breadcrumbArr = [], style } = config;
    return (
        <Breadcrumb style={style}>
            {
                breadcrumbArr.map(({ label, value }, i) => {
                    return (
                        <Breadcrumb.Item key={`breadcrumb-${i}`}>
                            { value ? 
                                <a href={value}>{label}</a> : <span>{label}</span>
                            }
                        </Breadcrumb.Item>
                    );
                })
            }
        </Breadcrumb>
    )
};
const renderText = (config) => {
    const { text, style } = config;
    return (
        <span style={style}>{text}</span>
    );
};
const renderRadio = (config) => {
    const { style = {}, radioArr = [] } = config;
    return (
        <Radio.Group style={{ ...style }}>
            {
                Array.isArray(radioArr) ? radioArr.map(({ key, label, value }) => {
                    return (
                        <Radio
                            key={key || value}
                            value={value}
                        >
                            {label}
                        </Radio>
                    );
                }) : null
            }
        </Radio.Group>
    );
};
const renderTabs = (config) => {
    const { style = {}, tabsArr = [] } = config;
    return (
        <Tabs style={style}>
            {
                Array.isArray(tabsArr) ? tabsArr.map(({ key, label, value }) => {
                    return (
                        <TabPane
                            key={key || value}
                            tab={label}
                        >

                        </TabPane>
                    );
                }) : null
            }
        </Tabs>
  );
};
const renderCheckbox = (config) => {
    const { style = {}, checkboxArr = [] } = config;
    return (
        <CheckboxGroup options={checkboxArr} style={{ width: "100%", ...style }} />
    );
};
const renderSelect = (config) => {
    const { style = {}, selectArr = [] } = config;
    return (
        <Select style={{ width: '100%', ...style }}>
            {
                Array.isArray(selectArr) ? selectArr.map(({ key, label, value }) => {
                    return (
                        <Option
                            key={key || value}
                            value={value}
                        >
                            {label}
                        </Option>
                    );
                }) : null
            }
        </Select>
    );
};
const renderDatePicker = (config) => {
    const { showTime, format } = config;
        return (
            <DatePicker
                style={{ width: '100%' }}
                showTime={showTime}
                format={format}
            />
        );
};
const renderRangePicker = (config) => {
    const { showTime, format } = config;
        return (
            <RangePicker
                showTime={showTime}
                format={format}
                style={{ width: '100%' }}
            />
        );
}

const renderBtn = (itemConfig) => {
    const { btnArr } = itemConfig;
    return (
        <Fragment>
            {
                btnArr.map((btn) => {
                    const { btnText = 'button', expandFlag, expandCount,
                        style = {}, index, ...btnProps } = btn;
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

export default renderComponent;