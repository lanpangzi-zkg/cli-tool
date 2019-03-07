import React, { Component, Fragment } from 'react';
import { Card, DatePicker, Select, Icon, Input, Form } from 'antd';
import getCellColSpan, { strToObj } from '../common/CellUtil';
import formItemLayout from '../configs/layout';
import { TRUE } from '../common/Constants';

const { Option } = Select;

class BaseEdit extends Component {
    constructor(props) {
		super(props);
		this.state = {
            deleteComponent: false,
        };
        this.onDeleteComponent = this.onDeleteComponent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onAddListItem = this.onAddListItem.bind(this);
        this.onDeleteListItem = this.onDeleteListItem.bind(this);
        this.renderBtnPanelHeader = this.renderBtnPanelHeader.bind(this);
        this.onDeleteButton = this.onDeleteButton.bind(this);
        this.onAddButton = this.onAddButton.bind(this);
    }
    getItemSetType() {
        return [];
    }
    componentWillReceiveProps(nextProps) {
		const { dropConfig } = nextProps;
        const { type } = dropConfig;
        const itemSetType = this.getItemSetType();
		if (~itemSetType.indexOf(type) && !this[`init${type}`] && nextProps.visible) {
			const lowerCaseType = type.toLowerCase();
			const stateKey = `${lowerCaseType}Arr`;
			const stateVal = dropConfig[stateKey] || [];
			this.setState({
				[stateKey]: stateVal,
            });
			this[`${lowerCaseType}Index`] = stateVal.length;
			this[`init${type}`] = true;
		}
	}
    handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
		const { deleteComponent, btnArr } = this.state;
        const { form, onUpdateConfigs, dropConfig, colSpanArr,
            formItemArr, inForm = true } = this.props;
        const itemSetType = this.getItemSetType();
		form.validateFields((err, values) => {
	        if (!err) {
                const newDropConfig = Object.assign({}, dropConfig, values);
				if (deleteComponent) {
					newDropConfig.deleteFlag = true;
				}
				newDropConfig.cellStyles = strToObj(values.cellStyles);
				const configType = newDropConfig.type;
				if (~itemSetType.indexOf(configType) && configType !== 'Btn') {
					const lowerCaseType = configType.toLowerCase();
					const stateKey = `${lowerCaseType}Arr`;
					const newList = this.state[stateKey].slice();
					newList.forEach((item) => {
						const { index } = item;
						const kLabel = `${lowerCaseType}Label-${index}`;
						const kValue = `${lowerCaseType}Value-${index}`;
						item.label = values[kLabel];
						item.value= values[kValue];
						delete newDropConfig[kLabel];
						delete newDropConfig[kValue];
					});
					newDropConfig[stateKey] = newList;
				} else if (configType === 'DatePicker' || configType === 'RangePicker') {
					const { format } = values;
					newDropConfig.showTime = values.showTime === TRUE;
					if (configType === 'DatePicker') {
						newDropConfig.defaultValue = values.defaultValue && values.defaultValue.format(format);
					}
				} else if (configType === 'Btn') {
					const newBtnArr = btnArr.slice();
					newBtnArr.forEach((item) => {
						const { index } = item;
						const btnText = `btnText-${index}`;
						const btnType = `type-${index}`;
						const htmlType = `htmlType-${index}`;
						const onClick = `onClick-${index}`;
						const expandFlag = `expandFlag-${index}`;
						const btnStyle = `btnStyle-${index}`;
						item.btnText = values[btnText];
						item.type= values[btnType];
						item.htmlType = values[htmlType];
						item.expandFlag = values[expandFlag];
						item.style = strToObj(values[btnStyle]);
						if (item.htmlType !== 'submit') {
							item.onClick = values[onClick];
						}
						const expandCount = `expandCount-${index}`;
						if (values[expandFlag] === TRUE) {
							item.expandCount = values[expandCount];
						}
						delete newDropConfig[btnStyle];
						delete newDropConfig[expandCount];
						delete newDropConfig[expandFlag];
						delete newDropConfig[onClick];
						delete newDropConfig[htmlType];
						delete newDropConfig[btnText];
						delete newDropConfig[btnType];
					});
					newDropConfig.btnArr = newBtnArr;
                }
                if (inForm) {
                    const { originSpan = 1 } = values;
                    newDropConfig.originSpan = originSpan;
                    newDropConfig.colSpan = getCellColSpan(newDropConfig.colIndex, originSpan,
                        formItemArr, colSpanArr);
                }
                this.onCloseEdit();
				onUpdateConfigs(newDropConfig);
	        }
	      },
	    );
    }
    onCloseEdit() {
        this.initBtn = false;
        const itemSetType = this.getItemSetType();
        itemSetType.forEach((item) => {
            this[`init${item}`] = false;
        });
        this.setState({
			deleteComponent: false,
        });
    }
    onDeleteComponent() {
        this.setState({
			deleteComponent: true,
        });
    }
    onAddButton() {
		const { btnArr } = this.state;
		const newBtnArr = btnArr.slice();
		newBtnArr.push({
			btnText: 'button',
			type: 'primary',
			index: this.btnIndex,
		});
		this.setState({
			btnArr: newBtnArr,
		});
		this.btnIndex += 1;
	}
    onDeleteButton(index) {
		const { btnArr = [] } = this.state;
		const newBtnArr = btnArr.reduce((arr, item) => {
			if (item.index !== index) {
				arr.push(item);
			}
			return arr;
		}, []);
		this.setState({
			btnArr: newBtnArr,
		});
	}
    onDeleteListItem(index, key) {
		const stateKey = `${key}Arr`;
		const list = this.state[stateKey];
		const newList = list.reduce((arr, item) => {
			if (item.index !== index) {
				arr.push(item);
			}
			return arr;
		}, []);
		this.setState({
			[stateKey]: newList,
		});
    }
    onAddListItem(key) {
		const stateKey = `${key}Arr`;
		const list = this.state[stateKey];
		const newList = list.slice();
		newList.push({
			label: '',
			value: '',
			index: this[`${key}Index`],
		});
		this.setState({
			[stateKey]: newList,
		});
		this[`${key}Index`] += 1;
    }
    renderDefaultValueItem() {
		const { dropConfig, form } = this.props;
		const { type, defaultValue } = dropConfig;
        const { getFieldDecorator } = form;
        const itemSetType = this.getItemSetType();
		if (~itemSetType.indexOf(type)) {
			const lowerCaseType = type.toLowerCase();
			const stateKey = `${lowerCaseType}Arr`;
			const list = this.state[stateKey];
			return (
				<Form.Item {...formItemLayout} label="defaultValue">
					{getFieldDecorator('defaultValue', {
						initialValue: defaultValue,
					})(
						<Select>
						{
							list.map((item) => {
								const { index } = item;
								const optionValue = form.getFieldValue(`${lowerCaseType}Value-${index}`);
								const optionText = form.getFieldValue(`${lowerCaseType}Label-${index}`);
								return (
									<Option value={optionValue} key={`op-${index}`}>
										{`${optionValue}/${optionText}`}
									</Option>
								);
							})
						}
					</Select>
					)}
				</Form.Item>
			);
		} else if (type === 'DatePicker') {
			return (<Form.Item {...formItemLayout} label="defaultValue">
				{getFieldDecorator('defaultValue', {
					initialValue: defaultValue,
				})(
					<DatePicker style={{ width: '100%' }} />
				)}
			</Form.Item>);
		} else if (type === 'Input') {
			return (<Form.Item {...formItemLayout} label="defaultValue">
					{getFieldDecorator('defaultValue', {
						initialValue: defaultValue,
					})(
						<Input />
					)}
				</Form.Item>);
		} else if (type === 'Text') {
			return (<Form.Item {...formItemLayout} label="text">
					{getFieldDecorator('text', {
						initialValue: dropConfig.text,
					})(
						<Input />
					)}
				</Form.Item>);
		}  else {
			return null;
		}
	}
    renderBtnPanelHeader({ btnText, index }) {
        return (
            <div className="panel-header">
                <span className="title">{btnText}</span>
                <Icon
                    type="close"
                    className="btn-delete"
                    onClick={() => {
                        this.onDeleteButton(index);
                    }}
                />
            </div>
        );
    }
    renderTabs() {
		return this.renderItemSettingCard({ title: 'tab设置', dataKey:'tabs' });
	}
	renderBreadcrumb() {
		return this.renderItemSettingCard({ title: 'breadcrumb设置', dataKey: 'breadcrumb' });
	}
    renderSelect() {
		return this.renderItemSettingCard({ title: 'select设置', dataKey:'select' });
	}
	rendeRadio() {
		return this.renderItemSettingCard({ title: 'radio设置', dataKey:'radio' });
	}
	rendeCheckbox() {
		return this.renderItemSettingCard({ title: 'checkbox设置', dataKey:'checkbox' });
	}
    renderItemSettingCard({ title, dataKey }) {
		const { form } = this.props;
		const stateKey = `${dataKey}Arr`;
        const itemList = this.state[stateKey] || [];
		return (
			<Card
				title={title}
				extra={<Icon type="plus-circle" onClick={() => {
					this.onAddListItem(dataKey);
				}} />}
			>
				{
					itemList.map(({ label, value, index }) => {
						return (
							<Fragment key={`${dataKey}-${index}`}>
								<Form.Item
									key={`${dataKey}-label-${index}`}
									style={{ width: '45%', display: 'inline-block' }} 
								>
									{form.getFieldDecorator(`${dataKey}Label-${index}`, {
										initialValue: label,
									})(
										<Input placeholder="label" />
									)}
								</Form.Item>
								<Form.Item
									key={`${dataKey}-value-${index}`}
									style={{ width: '45%', display: 'inline-block', marginLeft: '10px' }} 
								>
									{form.getFieldDecorator(`${dataKey}Value-${index}`, {
										initialValue: value,
									})(
										<Input placeholder="value" />
									)}
								</Form.Item>
								<Icon
									type="close-circle"
									style={{ marginLeft: '6px', lineHeight: '39px' }}
									onClick={() => {
										this.onDeleteListItem(index, dataKey);
									}}
								/>
							</Fragment>
						);
					})
				}
			</Card>
		);
	}
}

export default BaseEdit;