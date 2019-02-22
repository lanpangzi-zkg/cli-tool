import React, { PureComponent, Fragment } from 'react';
import { Button, Card, Drawer, Divider, Collapse, Form, Input, Icon, Select } from 'antd';
import './index.css';

const Panel = Collapse.Panel;
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
        this.onAddColumn = this.onAddColumn.bind(this);
        this.onDeleteColumn = this.onDeleteColumn.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.visible !== this.props.visible && nextProps.visible) {
            this.setState({
                configs: nextProps.configs,
            });
            this.setColumnMaxIndex(nextProps);
        }
    }
    setColumnMaxIndex({ configs }) {
        const { columns = [] } = configs;
        this.columnMaxIndex = columns.length || 0;
    }
    addColumnMaxIndex() {
        this.columnMaxIndex += 1;
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
        const { pagination, rowSelection } = configs;
        const { pageSize = 10, pageSizeOptions = '10,20,30' } = pagination || {};
        const { type = 'checkbox', columnTitle = '选择' } = rowSelection || {};
        const hasPagination = Object.keys(pagination || {}).length > 0 ? "1" : "0";
        const hasRowSelection = Object.keys(rowSelection || {}).length > 0 ? "1" : "0";
        return (
            <Fragment>
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
                        <Form.Item label="pageSizeOptions" {...formItemLayout}>
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
            </Fragment>
        );
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
                            if (val === '1') {
                                newConfigs.pagination = {
                                    pageSize: values.pageSize,
                                    pageSizeOptions: values.pageSizeOptions.split(','),
                                };
                            } else {
                                newConfigs[k] = DIR[val];
                            }
                        } else if (k === 'rowSelection') {
                            if (val === '1') {
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
                this.props.onUpdateConfigs(newConfigs);
            }
          });
    }
    render() {
        const { visible, onClose } = this.props;
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
                        <Button type="primary" htmlType="submit">确定</Button>
                    </Form.Item>
                </Form>
            </Drawer>
        );
    }
}

export default Form.create()(TableEdit);