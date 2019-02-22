import React, { PureComponent, Fragment } from 'react';
import { Form, Row, Button, message, Icon } from 'antd';
import FormEdit from '../../EditDrawer/FormEdit';
import FormItemContainer from '../FormItemContainer';
import './index.css';

class FormContainer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            configs: {
                layoutColumn: 1, // 容器列数
                formItemArr: [],
            },
        };
        this.onShowEditForm = this.onShowEditForm.bind(this);
        this.onCloseEditForm = this.onCloseEditForm.bind(this);
        this.renderFormItemContainer = this.renderFormItemContainer.bind(this);
        this.onAddRow = this.onAddRow.bind(this);
        this.onDeleteRow = this.onDeleteRow.bind(this);
        this.onDeleteContainer = this.onDeleteContainer.bind(this);
        this.onDeleteFormItemContainer = this.onDeleteFormItemContainer.bind(this);
        this.onUpdateConfigs = this.onUpdateConfigs.bind(this);
        this.colIndexStart = 0;
    }
    onShowEditForm() {
        this.setState({
            visible: true,
        });
    }
    onCloseEditForm(configs) {
        const newState = {
            visible: false,
        };
        const { layoutColumn, colSpanArr } = configs;
        const layoutColumnNum = +layoutColumn;
        if (layoutColumnNum) {
            const formItemArr = this.state.configs.formItemArr.slice();
            // 新增一行
            if (formItemArr.length === 0) {
                for(let i = 0; i < layoutColumnNum; i++) {
                    formItemArr.push({
                        colIndex: this.colIndexStart + i,
                        colSpan: colSpanArr[i],
                    });
                }
            } else {
                formItemArr.forEach((item, i) => {
                    item.colSpan = colSpanArr[i % 3];
                });
            }
            this.colIndexStart += layoutColumnNum;
            configs.layoutColumn = layoutColumnNum;
            configs.formItemArr = formItemArr;
            newState.configs = configs;
        }
        this.setState({
            ...newState
        });
    }
    onAddRow() {
        const { configs } = this.state;
        const formItemArr = configs.formItemArr.slice();
        if (formItemArr.length === 0) {
            message.warn('请设置容器列数');
            return;
        }
        const { layoutColumn } = configs;
        for(let i = 0; i < layoutColumn; i++) {
            formItemArr.push({ colIndex: this.colIndexStart + i });
        }
        this.colIndexStart += layoutColumn;
        const newConfigs = Object.assign({}, configs);
        newConfigs.formItemArr = formItemArr;
        this.setState({
            configs: newConfigs,
        }, () => {
            const { onUpdateLayoutConfig, layoutIndex } = this.props;
            onUpdateLayoutConfig({ layoutIndex, configs: newConfigs });
        });
    }
    onDeleteRow() {
        const { configs } = this.state;
        const { layoutColumn, formItemArr } = configs;
        const newConfigs = Object.assign({}, configs);
        const newFormItemArr = formItemArr.slice();
        if (newFormItemArr.length <= layoutColumn) {
            message.warn('不能再删除了');
            return;
        }
        newFormItemArr.length = Math.max(0, newFormItemArr.length- layoutColumn);
        newConfigs.formItemArr = newFormItemArr;
        this.setState({
            configs: newConfigs,
        }, () => {
            const { onUpdateLayoutConfig, layoutIndex } = this.props;
            onUpdateLayoutConfig({ layoutIndex, newConfigs });
        });
    }
    onDeleteContainer() {
        const { onUpdateLayoutConfig, layoutIndex } = this.props;
        onUpdateLayoutConfig({ layoutIndex, deleteFlag: true });
    }
    onDeleteFormItemContainer(colIndex) {
        const { configs } = this.state;
        const { formItemArr } = configs;
        const newConfigs = Object.assign({}, configs);
        const newFormItemArr = formItemArr.filter((item) => {
            return item.colIndex !== colIndex;
        });
        newConfigs.formItemArr = newFormItemArr;
        this.setState({
            configs: newConfigs,
        }, () => {
            const { onUpdateLayoutConfig, layoutIndex } = this.props;
            onUpdateLayoutConfig({ layoutIndex, configs: newConfigs });
        });
    }
    onUpdateConfigs({ deleteFlag = false, ...values }) {
        const { configs } = this.state;
        const { formItemArr } = configs;
        const newConfigs = Object.assign({}, configs);
        const { onUpdateLayoutConfig, layoutIndex } = this.props;
        const newFormItemArr = formItemArr.reduce((arr, item) => {
            // 删除单元格
            if (deleteFlag) {
                if (values.colIndex !== item.colIndex) {
                    arr.push(Object.assign({}, item));
                } else {
                    arr.push({ colIndex: values.colIndex, colSpan: values.colSpan });
                }
            } else {
                if (values.colIndex === item.colIndex) {
                    arr.push(Object.assign({}, item, values));
                } else {
                    arr.push(Object.assign({}, item));
                }
            }
            return arr;
        }, []);
        newConfigs.formItemArr = newFormItemArr;
        this.setState({
            configs: newConfigs,
        }, () => {
            onUpdateLayoutConfig({ layoutIndex, configs: newConfigs });
        });
    }
    renderFormItemContainer() {
        const { configs } = this.state;
        const { formItemArr, layoutColumn } = configs;
        return formItemArr.map(({ colIndex, colSpan }) => {
            return (
                <FormItemContainer
                    key={`ed-${colIndex}`}
                    colIndex={colIndex}
                    {...this.props}
                    colSpan={colSpan}
                    layoutColumn={layoutColumn}
                    onDeleteFormItemContainer={this.onDeleteFormItemContainer}
                    onUpdateConfigs={this.onUpdateConfigs}
                />
            );
        });
    }
    render() {
        const { visible, configs } = this.state;
        const { layoutIndex, onUpdateLayoutConfig } = this.props;
        const { layoutColumn, formItemArr } = configs;
        return (
            <Fragment>
                <div className="form-container container">
                    <div className="inner-box">
                        {
                            <Form>
                                <Row
                                    gutter={{ md: 24 / layoutColumn, lg: 24, xl: 48 }}
                                >
                                    {this.renderFormItemContainer()}
                                </Row>
                            </Form>
                        }
                        {
                            formItemArr.length > 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    margin: '10px 0',
                                    paddingBottom: '10px',
                                    }}
                                >
                                    <Button
                                        onClick={this.onAddRow}
                                    >
                                        新增一行
                                    </Button>
                                    <Button
                                        onClick={this.onDeleteRow}
                                        style={{ marginLeft: '8px' }}
                                    >
                                        删除一行
                                    </Button>
                                </div>
                                ) : null
                        }
                    </div>
                    <Icon type="form" className="icon-operation" onClick={this.onShowEditForm} />
                    <Icon type="close-circle" className="icon-operation" onClick={this.onDeleteContainer} />
                </div>
                <FormEdit
                    visible={visible}
                    onClose={(configs) => {
                        const { layoutColumn } = configs;
                        this.onCloseEditForm(configs);
                        if (layoutColumn) {
                            const layoutConfig = {
                                layoutIndex,
                                configs,
                            };
                            onUpdateLayoutConfig(layoutConfig);
                        }
                    }}
                />
            </Fragment>  
        );
    }
}

export default Form.create()(FormContainer);