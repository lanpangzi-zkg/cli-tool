import React, { PureComponent, Fragment } from 'react';
import { Form, Table, Col, Checkbox, Row, Input, Icon, Select, Radio, DatePicker, Button } from 'antd';
import moment  from 'moment';
import 'antd/dist/antd.css';
import '../assets/common.css';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;  

class BaseView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.onSubmit = this.onSubmit.bind(this);
        this.onCollapse = this.onCollapse.bind(this);
    }
    componentWillMount() {
        const layoutConfig = this.getLayoutConfig();
        if (Array.isArray(layoutConfig)) {
            const formLayout = layoutConfig.find((item) => {
                return item.type === 'FormContainer';
            });
            if (formLayout) {
                const { configs: { formItemArr } } = formLayout;
                const btnLayout = formItemArr.find((f) => {
                    return f.type === 'Btn';
                });
                if (btnLayout) {
                    const expandBtn = btnLayout.btnArr.find((b) => {
                        return b.expandFlag;
                    });
                    // 拥有折叠按钮
                    if (expandBtn) {
                        this.state.expand = expandBtn.expand;
                        this.state.expandCount = expandBtn.expandCount;
                    }
                }
              
            }
        }
    }
    onSubmit(e) {
        e.preventDefault();
    }
    getLayoutConfig() {
        return null;
    }
    onCollapse() {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    }
    _onShowSizeChange(current, size) {
        if (this.isFunc('onShowSizeChange')) {
            this.onShowSizeChange(current, size);
        }
    }
    _onChange(page, pageSize) {
        if (this.isFunc('onChange')) {
            this.onChange(page, pageSize);
        }
    }
    getInitialValue(config) {
        const { type = 'Input', defaultValue, dateFormat = 'YYYY-MM-DD' } = config;
        if (type === 'DatePicker' || type === 'RangePicker') {
            return defaultValue && moment(defaultValue, dateFormat);
        }
        return config.defaultValue || '';
    }
    getTableData() {
        return [];
    }
    isFunc(fnName) {
        return typeof this[fnName] === 'function';
    }
    renderRow(formItemArr, linkage) {
        const copyFormItemArr = formItemArr.slice();
        const singleIndex = copyFormItemArr.findIndex((item) => {
            return item.singleRow;
        });
        const singleRowItem = copyFormItemArr[singleIndex];
        // 是否有单独渲染的一行
        if (singleIndex > -1) {
            copyFormItemArr.splice(singleIndex, 1);
        }
        return (
            [<Row key="basic-row" gutter={{ md: 8, lg: 24, xl: 48 }}>
                {
                    this.renderCol(copyFormItemArr, linkage)
                }
            </Row>, singleRowItem ? (
            <Row key="single-row">
                <Col style={{ ...singleRowItem.style }}>
                    <span className="btn-group-box">
                        {
                            this.renderBtn(singleRowItem)
                        }
                    </span>
                </Col>
            </Row>) : null]
        );
    }
    renderCol(formItemArr, linkage = {}) {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return formItemArr.map((config, i) => {
            const { label, name, colIndex, type, singleRow = false } = config;
            if (singleRow) {
                return null;
            }
            if (type === 'Btn') {
                return (<Col md={8} sm={24} key={`col-${colIndex}`}>
                    {this.renderBtn(config)}
                </Col>);
            }
            // 联动显示控制
            if (Object.hasOwnProperty.call(linkage, name)) {
                const relateObj = linkage[name];
                const { linkName, condition } = relateObj;
                if (form.getFieldValue(linkName) !== condition) {
                    return null;
                }
            }
            const displayStyle = {
                display: 'block',
            };
            if (Object.hasOwnProperty.call(this.state, 'expand')) {
                const { expand, expandCount } = this.state;
                // 隐藏组件
                if (!expand && (i+1) > expandCount) {
                    displayStyle.display = 'none';
                }
            }
            return (
                <Col md={8} sm={24} key={`col-${colIndex}`} style={displayStyle}>
                    <FormItem label={label}>
                        {getFieldDecorator(name, {
                            rules: [],
                            initialValue: this.getInitialValue(config),
                        })(
                            this.renderItemComponent(config)
                        )}
                    </FormItem>
                </Col>
            );
        });
    }
    renderItemComponent(config) {
        const { placeholder, type = 'Input' } = config;
        let itemComponent = null;
        switch(type) {
            case 'Select':
                itemComponent = this.renderSelect(config);
                break;
            case 'RangePicker':
                itemComponent = this.renderRangePicker(config);
                break;
            case 'DatePicker':
                itemComponent = this.renderDatePicker(config);
                break;
            case 'Btn':
                itemComponent = this.renderBtn(config);
                break;
            case 'Radio':
                itemComponent = this.renderRadio(config);
                break;
            case 'Checkbox':
                itemComponent = this.renderCheckbox(config);
                break;
            default:
                itemComponent = (<Input placeholder={placeholder} />);
                break;
        }
        return itemComponent; 
    }
    renderSelect(config) {
        const { style = {}, options = [] } = config;
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
    renderRadio(config) {
        const { style = {}, radios = [] } = config;
        return (
            <Radio.Group style={{ ...style }}>
                {
                    Array.isArray(radios) ? radios.map(({ key, radioValue, radioText }) => {
                        return (
                            <Radio
                                key={key || radioValue}
                                value={radioValue}
                            >
                                {radioText}
                            </Radio>
                        );
                    }) : null
                }
            </Radio.Group>
        );
    }
    renderCheckbox(config) {
        const { style = {}, cks = [] } = config;
        return (
            <Checkbox.Group style={{  width: "100%", ...style }}>
                {
                    Array.isArray(cks) ? cks.map(({ key, ckValue, ckText }) => {
                        return (
                            <Checkbox
                                key={key || ckValue}
                                value={ckValue}
                            >
                                {ckText}
                            </Checkbox>
                        );
                    }) : null
                }
            </Checkbox.Group>
        );
    }
    renderDatePicker(config) {
        return (
            <DatePicker style={{ width: '100%' }} />
        );
    }
    renderRangePicker(config) {
        return (
            <RangePicker style={{ width: '100%' }} />
        );
    }
    renderBtn(config) {
        const { btnArr } = config;
        return (
            <Fragment>
                {
                    btnArr.map((btn) => {
                        const { btnText = 'button', index, props, expandFlag = false } = btn;
                        if (expandFlag) {
                            const { expand } = this.state;
                            const collapseBtnText = expand ? '隐藏' : '展开';
                            return (
                                <a
                                    className="btn-collapse"
                                    onClick={this.onCollapse}
                                    href="javascript:void(0);"
                                    key={`btn-${index}`}
                                >
                                    {collapseBtnText}
                                    <Icon type={expand ? 'up' : 'down'} />
                                </a>
                                );
                        }
                        return (
                            <Button
                                key={`btn-${index}`}
                                {...props}
                            >
                                {btnText}
                            </Button>
                        );
                    })
                }
            </Fragment>
        );
    }
    _renderHeader({ configs }) {
        if (this.isFunc('renderHeader')) {
            return this.renderHeader(configs);
        }
        return (
            <div className="fulu-header">header</div>
        );
    }
    _renderForm({ configs }) {
        if (this.isFunc('renderForm')) {
            return this.renderForm(configs);
        }
        const { linkage, formItemArr } = configs;
        return (
            <div className="form-box fulu-box" key="query-form">
                <Form onSubmit={this.onSubmit} layout="inline">
                    {
                        this.renderRow(formItemArr, linkage)
                    }
                </Form>
            </div>
        );
    }
    _renderTable({ configs }) {
        if (this.isFunc('renderTable')) {
            return this.renderTable(configs);
        }
        const { pagination, rowSelection, ...props } = configs;
        const newPagination = Object.assign({
            size: "small",
            onShowSizeChange: this._onShowSizeChange,
            onChange: this._onShowSizeChange,
            showTotal: (t)=>{return `共${t}条`},
            pageSizeOptions: ['10', '20', '30', '40'],
            total: this.getTableTotal(),
            defaultPageSize: 1,
            showSizeChanger: true,
            showQuickJumper: true,
        }, pagination);
        const dataSource = this.getTableData();
        return (
            <div className="table-box fulu-box" key="query-table">
                <Table
                    dataSource={dataSource}
                    pagination={newPagination}
                    rowSelection={rowSelection}
                    columns={configs.columns}
                    {...props}
                />
            </div>
        );
    }
    _renderTab({ configs }) {
        if (this.isFunc('renderTab')) {
            return this.renderTab(configs);
        }
        return null;
    }
    _renderCustom({ configs }) {
        if (this.isFunc('renderCustom')) {
            return this.renderCustom(configs);
        }
        return null;
    }
    renderContent(layoutConfig) {
        return layoutConfig.map((item) => {
            const { type } = item;
            if (type === 'FormContainer') {
                return this._renderForm(item);
            } else if (type === 'TableContainer') {
                return this._renderTable(item);
            } else if (type === 'CustomContainer') {
                return this._renderCustom(item);
            }
            return null;
        });
    }
    render() {
        const layoutConfig = this.getLayoutConfig();
        return (
            <div className="wrapper">
                {
                    Array.isArray(layoutConfig) ?
                    this.renderContent(layoutConfig) : null
                }
            </div>
        );
    }
}

export default BaseView;