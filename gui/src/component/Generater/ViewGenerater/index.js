import React, { PureComponent, Fragment } from 'react';
import { Form, Table, Col, Row, Input, Icon, Button } from 'antd';
import moment  from 'moment';
import renderComponent from '../../common/RenderUtil';
import 'antd/dist/antd.css';
import '../assets/common.css';

const FormItem = Form.Item;

class ViewGenerater extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.onSubmit = this.onSubmit.bind(this);
        this.onCollapse = this.onCollapse.bind(this);
    }
    componentWillMount() {
        const { layoutConfig } = this.props;
        if (Array.isArray(layoutConfig)) {
            const formLayout = layoutConfig.find((item) => {
                return item.type === 'FormContainer';
            });
            if (formLayout) {
                const { configs: { formItemArr } } = formLayout;
                const btnLayout = formItemArr && formItemArr.find((f) => {
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
    renderRow(formItemArr) {
        if (!Array.isArray(formItemArr)) {
            return null;
        }
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
                    this.renderCol(copyFormItemArr)
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
    renderCol(formItemArr) {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return formItemArr.map((config, i) => {
            const { label, name, colSpan = 8, colIndex, type, cellStyles = {}, singleRow = false, hasLinkage } = config;
            if (singleRow) {
                return null;
            }
            if (type === 'Btn') {
                return (<Col md={colSpan} sm={24} key={`col-${colIndex}`}>
                    <FormItem style={cellStyles}>
                        {this.renderBtn(config)}
                    </FormItem>
                </Col>);
            }
            if (!name) {
                return null;
            }
            // 联动显示控制
            if (hasLinkage === '1') {
                const { linkName, condition } = config;
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
                <Col md={colSpan} sm={24} key={`col-${colIndex}`} style={displayStyle}>
                    <FormItem label={label} style={cellStyles}>
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
        const { type = 'Input' } = config;
        let itemComponent = null;
        switch(type) {
            case 'Select':
            case 'RangePicker':
            case 'DatePicker':
            case 'Radio':
            case 'Checkbox':
                itemComponent = renderComponent(config);
                break;
            case 'Btn':
                itemComponent = this.renderBtn(config);
                break;
            default:
                itemComponent = renderComponent(config);
                break;
        }
        return itemComponent; 
    }
    renderBtn(config) {
        const { btnArr } = config;
        return (
            <Fragment>
                {
                    btnArr.map((btn) => {
                        const { btnText = 'button', type, index, props,
                            style = {}, expandFlag = '0' } = btn;
                        if (expandFlag === '1') {
                            const { expand } = this.state;
                            const collapseBtnText = expand ? '隐藏' : '展开';
                            return (
                                <a
                                    className="btn-collapse"
                                    onClick={this.onCollapse}
                                    href="&nbsp;"
                                    style={style}
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
                                type={type}
                                style={style}
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
    renderBoxCell(layoutColumn, cellsArr) {
        if (!layoutColumn) {
            return null;
        }
        const componentArr = [];
        const width = `${100 / layoutColumn}%`;
        for (let i = 0; i < layoutColumn; i++) {
            const dropConfig = cellsArr[i] || {};
            const { cellStyles = {} } = dropConfig;
            // 没有组件渲染，设置最小高度，撑开布局
            if (!dropConfig.type) {
                cellStyles.minHeight = '1.5em';
            }
            componentArr.push((
               <div className="cell" key={`cell-${i}`} style={{ width, ...cellStyles }}>
                   {dropConfig.type && renderComponent(cellsArr[i])}
               </div>
            ));
        }
        return componentArr;
    }
    _renderBox({ configs }) {
        const { boxStyles, layoutColumn, cellsArr } = configs;
        return (
            <div
                className="fulu-cell-box"
                style={boxStyles}
                key={`cell-box-${layoutColumn}`}
            >
                {this.renderBoxCell(layoutColumn, cellsArr)}
            </div>
        );
    }
    _renderForm({ configs }) {
        if (this.isFunc('renderForm')) {
            return this.renderForm(configs);
        }
        const { formItemArr } = configs;
        return (
            <div className="form-box fulu-box" key="query-form">
                <Form onSubmit={this.onSubmit} layout="inline">
                    {
                        this.renderRow(formItemArr)
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
        const total = this.isFunc('getTableTotal') ? this.getTableTotal() : 0;
        const newPagination = Object.assign({
            size: "small",
            onShowSizeChange: this._onShowSizeChange,
            onChange: this._onShowSizeChange,
            showTotal: (t)=>{return `共${t}条`},
            pageSizeOptions: ['10', '20', '30', '40'],
            total,
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
            if (type === 'BoxContainer') {
                return this._renderBox(item);
            } else if (type === 'FormContainer') {
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

export default ViewGenerater;