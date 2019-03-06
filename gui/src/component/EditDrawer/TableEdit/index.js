import React, { PureComponent, Fragment } from 'react';
import { Button, Card, Drawer, Divider, Collapse, Form, Input, Icon, Select } from 'antd';
import formItemLayout from '../../configs/layout';
import handleOperation from '../../common/TableUtil';
import { TRUE } from '../../common/Constants';
import './index.css';

const Panel = Collapse.Panel;
const Option = Select.Option;

const fLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
};

const DIR = {
    '0': false,
    '1': true,
};

class TableEdit extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            configs: props.configs,
        };
        this.setColumnMaxIndex(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onAddOperation = this.onAddOperation.bind(this);
        this.onDeleteOperation = this.onDeleteOperation.bind(this);
        this.onAddColumn = this.onAddColumn.bind(this);
        this.onDeleteColumn = this.onDeleteColumn.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.visible !== this.props.visible && nextProps.visible) {
            this.setState({
                configs: nextProps.configs,
            });
            this.setColumnMaxIndex(nextProps);
            this.setOperationMaxIndex(nextProps);
        }
    }
    setColumnMaxIndex({ configs }) {
        const { columns = [] } = configs;
        this.columnMaxIndex = columns.length || 0;
    }
    setOperationMaxIndex({ configs }) {
        const { operationArr = [] } = configs;
        this.operationMaxIndex = operationArr.length || 0;
    }
    addColumnMaxIndex() {
        this.columnMaxIndex += 1;
    }
    addOperationMaxIndex() {
        this.operationMaxIndex += 1;
    }
    onAddOperation() {
        const { configs } = this.state;
        const { operationArr = [] } = configs;
        const newOperationArr = operationArr.slice();
        const opreationIndex = this.operationMaxIndex;
        newOperationArr.push({
            opText: "操作",
            index: opreationIndex,
        });
        this.setState({
            configs: this.getNewConfigs('operationArr', newOperationArr),
        });
        this.addOperationMaxIndex();
    }
    onAddColumn() {
        const { configs } = this.state;
        const { columns } = configs;
        const newColumns = columns.slice();
        const columnIndex = this.columnMaxIndex;
        newColumns.push({
            title: `column${columnIndex}`,
            dataIndex: `dataIndex${columnIndex}`,
            index: columnIndex,
        });
        this.setState({
            configs: this.getNewConfigs('columns', newColumns),
        });
        this.addColumnMaxIndex();
    }
    onDeleteOperation(index) {
        const { configs } = this.state;
        const { operationArr } = configs;
        const newOperationArr = operationArr.reduce((arr, item) => {
            if (item.index !== index) {
                arr.push(Object.assign({}, item));
            }
            return arr;
        }, []);
        const newConfigs = Object.assign({}, configs);
        newConfigs.operationArr = newOperationArr;
        this.setState({
            configs: this.getNewConfigs('operationArr', newOperationArr),
        });
    }
    onDeleteColumn(columnIndex) {
        const { configs } = this.state;
        const { columns } = configs;
        const newColumns = columns.reduce((arr, item) => {
            if (item.index !== columnIndex) {
                arr.push(Object.assign({}, item));
            }
            return arr;
        }, []);
        const newConfigs = Object.assign({}, configs);
        newConfigs.columns = newColumns;
        this.setState({
            configs: this.getNewConfigs('columns', newColumns),
        });
    }
    getNewConfigs(k, v) {
        const { configs } = this.state;
        const newConfigs = Object.assign({}, configs);
        newConfigs[k] = v;
        return newConfigs;
    }
    onSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const newConfigs = {};
                const { configs } = this.state;
                // 有操作列
                if (values.hasOperation === TRUE) {
                    const { operationArr } = configs;
                    const newOperationArr = [];
                    for (let i = 0; i< operationArr.length; i++) {
                        const { index } = operationArr[i];
                        const opText = values[`opText-${index}`];
                        const opType = values[`opType-${index}`];
                        newOperationArr.push({
                            opText,
                            opType,
                            index: i,
                        });
                        delete values[opText];
                        delete values[opType];
                    }
                    newConfigs.operationArr = newOperationArr;
                }
                const newColumns = configs.columns.slice();
                Object.keys(values).forEach((k) => {
                    const val = values[k];
                    // 列数据
                    if (k.indexOf('-') > 0) {
                        const [ columnName, columnIndex ] = k.split('-');
                        const columnTarget = newColumns.find((item) => {
                            return item.index === +columnIndex;
                        });
                        if (columnTarget) {
                            columnTarget[columnName] = val;
                            if (columnName === 'width' && !val) {
                                delete columnTarget.width;
                            }
                            if (columnName === 'fixed') {
                                columnTarget[columnName] = DIR[val];
                            }
                        }
                    } else {
                        if (k === 'pagination') {
                            if (val === TRUE) {
                                newConfigs.pagination = {
                                    pageSize: values.pageSize,
                                    pageSizeOptions: values.pageSizeOptions.split(','),
                                };
                            } else {
                                newConfigs[k] = DIR[val];
                            }
                        } else if (k === 'rowSelection') {
                            if (val === TRUE) {
                                newConfigs.rowSelection = {
                                    type: values.type,
                                };
                                if (values.type === 'radio') {
                                    newConfigs.rowSelection.columnTitle = values.columnTitle;
                                }
                            } else {
                                newConfigs[k] = null;
                            }
                        } else {
                            newConfigs[k] = val;
                        }
                    }
                });
                delete newConfigs.pageSize;
                delete newConfigs.pageSizeOptions;
                delete newConfigs.type;
                delete newConfigs.columnTitle;

                newConfigs.columns = newColumns;
                handleOperation(newConfigs);
                this.props.onUpdateConfigs(newConfigs);
            }
          });
    }
    renderPanelHeader({ title, index }) {
        return (
            <div className="panel-header">
                <span className="title">{title}</span>
                <Icon
                    type="close"
                    className="btn-delete"
                    onClick={() => {
                        this.onDeleteColumn(index);
                    }}
                />
            </div>
        );
    }
    renderOperationHeader({ opText, index }) {
        return (
            <div className="panel-header">
                <span className="title">{opText}</span>
                <Icon
                    type="close"
                    className="btn-delete"
                    onClick={() => {
                        this.onDeleteOperation(index);
                    }}
                />
            </div>
        );
    }
    renderCollapse() {
        const { form } = this.props;
        const { configs } = this.state;
        const { columns = [] } = configs;
        const { getFieldDecorator } = form;
        return (
            <Collapse>
                {
                    columns.map((item, i) => {
                        const { title, index, dataIndex, width, align = 'left', fixed = false } = item;
                        if (title === '操作' && i === columns.length -1) {
                            return null;
                        }
                        return (
                            <Panel header={this.renderPanelHeader(item)} key={`${title}-${index}`}>
                                <Form.Item label="title" {...formItemLayout}>
                                    {getFieldDecorator(`title-${index}`, { 
                                        rules: [{ required: true, message: '请输入title!' }],
                                        initialValue: title,
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                                <Form.Item label="dataIndex" {...formItemLayout}>
                                    {getFieldDecorator(`dataIndex-${index}`, { 
                                        rules: [{ required: true, message: 'dataIndex!' }],
                                        initialValue: dataIndex,
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                                <Form.Item label="width" {...formItemLayout}>
                                    {getFieldDecorator(`width-${index}`, {
                                        initialValue: width || '',
                                    }, {
                                        rules: [{ pattern: /^\d+(%)?$/, message: '请输入数字或者百分比!' }]
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                                <Form.Item label="align" {...formItemLayout}>
                                    {getFieldDecorator(`align-${index}`, { 
                                        initialValue: align,
                                    })(
                                        <Select>
                                            <Option value={'left'}>left</Option>
                                            <Option value={'right'}>right</Option>
                                            <Option value={'center'}>center</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item label="fixed" {...formItemLayout}>
                                    {getFieldDecorator(`fixed-${index}`, { 
                                        initialValue: fixed ? "1" : "0",
                                    })(
                                        <Select>
                                            <Option value="0">false</Option>
                                            <Option value="1">true</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Panel>
                        );
                    })
                }
            </Collapse>
        );
    }
    renderTableProps() {
        const { form } = this.props;
        const { configs } = this.state;
        const { getFieldDecorator } = form;
        const {  operationArr = [], pagination, rowSelection, hasOperation = '0', mockData = 0 } = configs;
        const { pageSize = 10, pageSizeOptions = '10,20,30' } = pagination || {};
        const { type = 'checkbox', columnTitle = '选择' } = rowSelection || {};
        const hasPagination = Object.keys(pagination || {}).length > 0 ? "1" : "0";
        const hasRowSelection = Object.keys(rowSelection || {}).length > 0 ? "1" : "0";
        return (
            <Fragment>
                <Form.Item label="操作列" {...formItemLayout}>
                    {getFieldDecorator("hasOperation", { 
                        initialValue: hasOperation,
                    })(
                        <Select>
                            <Option value="0">无</Option>
                            <Option value="1">有</Option>
                        </Select>
                    )}
                </Form.Item>
                {
                    form.getFieldValue('hasOperation') === '1' ?
                        [
                            <Collapse key="op-collapse">
                                {
                                    operationArr.map((item) => {
                                        const { index, opText, opType } = item;
                                        return (
                                            <Panel header={this.renderOperationHeader(item)} key={`op-${index}`}>
                                                <Form.Item label="文字" {...formItemLayout}>
                                                    {getFieldDecorator(`opText-${index}`, { 
                                                        initialValue: opText,
                                                    })(
                                                        <Input />
                                                    )}
                                                </Form.Item>
                                                <Form.Item label="类型" {...formItemLayout}>
                                                    {getFieldDecorator(`opType-${index}`, { 
                                                        initialValue: opType,
                                                    })(
                                                        <Select>
                                                            <Option value="edit">编辑</Option>
                                                            <Option value="view">查看</Option>
                                                            <Option value="delete">删除</Option>
                                                            <Option value="other">其他</Option>
                                                        </Select>
                                                    )}
                                                </Form.Item>
                                            </Panel>
                                        );
                                    })
                                }
                            </Collapse>,
                            <Fragment key="op-collapse-btns">
                                {
                                    form.getFieldValue('hasOperation') === '1' ?
                                        (<div className="btn-add-box">
                                            <Button
                                                type="dashed"
                                                size="large"
                                                onClick={this.onAddOperation}
                                            >
                                                添加操作项
                                            </Button>
                                        </div>) : null
                                }
                            </Fragment>
                        ] : null
                }
                <Form.Item label="pagination" {...formItemLayout}>
                    {getFieldDecorator("pagination", { 
                        initialValue: hasPagination,
                    })(
                        <Select>
                            <Option value="0">false</Option>
                            <Option value="1">true</Option>
                        </Select>
                    )}
                </Form.Item>
                {
                    form.getFieldValue('pagination') === '1' ?
                    <Card title="pagination配置">
                        <Form.Item label="pageSize" {...formItemLayout}>
                            {getFieldDecorator("pageSize", { 
                                initialValue: pageSize,
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item label="pageSizeOptions" {...fLayout}>
                            {getFieldDecorator("pageSizeOptions", { 
                                initialValue: Array.isArray(pageSizeOptions)
                                    ? pageSizeOptions.join(',') : pageSizeOptions,
                            })(
                                <Select>
                                    <Option value="10,20,30">10,20,30</Option>
                                    <Option value="10,20,30,40">10,20,30,40</Option>
                                    <Option value="20,30,40">20,30,40</Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Card> : null
                }
                <Form.Item label="rowSelection" {...formItemLayout}>
                    {getFieldDecorator("rowSelection", { 
                        initialValue: hasRowSelection,
                    })(
                        <Select>
                            <Option value="0">false</Option>
                            <Option value="1">true</Option>
                        </Select>
                    )}
                </Form.Item>
                {
                    form.getFieldValue('rowSelection') === '1' ?
                    <Card title="rowSelection配置">
                        <Form.Item label="type" {...formItemLayout}>
                            {getFieldDecorator("type", { 
                                initialValue: type,
                            })(
                                <Select>
                                    <Option value="checkbox">checkbox</Option>
                                    <Option value="radio">radio</Option>
                                </Select>
                            )}
                        </Form.Item>
                        {
                            form.getFieldValue('type') === 'radio' ?
                                <Form.Item label="columnTitle" {...formItemLayout}>
                                    {getFieldDecorator("columnTitle", { 
                                        initialValue: columnTitle,
                                    })(
                                        <Input />
                                    )}
                                </Form.Item> : null
                        }
                    </Card> : null
                }
                <Form.Item label="模拟数据" {...formItemLayout}>
                    {getFieldDecorator("mockData", {
                        initialValue: mockData,
                    })(
                        <Input placeholder="请输入数据条数" />
                    )}
                </Form.Item>
            </Fragment>
        );
    }
    render() {
        const { visible, onClose, onDeleteContainer } = this.props;
        return (
            <Drawer
                title="表格编辑"
                width={420}
                onClose={onClose}
                visible={visible}
            >
                <Form onSubmit={this.onSubmit}>
                    <Divider>表头</Divider>
                    {this.renderCollapse()}
                    <div className="btn-add-box">
                        <Button
                            type="dashed"
                            size="large"
                            onClick={this.onAddColumn}
                        >
                            添加表头列
                        </Button>
                    </div>
                    <Divider>表格属性</Divider>
                    {this.renderTableProps()}
                    <Form.Item style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginRight: '10px' }}
                        >
                            确定
                        </Button>
                        <Button onClick={onDeleteContainer}>删除容器</Button>
                    </Form.Item>
                </Form>
            </Drawer>
        );
    }
}

export default Form.create()(TableEdit);