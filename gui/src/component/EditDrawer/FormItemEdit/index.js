import React, { Component, Fragment } from 'react';
import { Button, Card, Drawer, Divider, Select, Input, Icon, Form, DatePicker } from 'antd';
import './index.css';

const Option = Select.Option;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

class FormItemEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			deleteComponent: false,
			options: [],
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.onAddOptionItem = this.onAddOptionItem.bind(this);
		this.onAddButton = this.onAddButton.bind(this);
		this.onDeleteOptionItem = this.onDeleteOptionItem.bind(this);
		this.onDeleteButton = this.onDeleteButton.bind(this);
		this.onDeleteComponent = this.onDeleteComponent.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		const { formItemConfig } = nextProps;
		const { type, options, btnArr } = formItemConfig;
		if (type === 'Option' && !this.initOptions) {
			this.setState({
				options,
			});
			this.optionIndex = options.length;
			this.initOptions = true;
		}
		if (type === 'Btn' && !this.initBtn) {
			this.setState({
				btnArr,
			});
			this.btnIndex = btnArr.length;
			this.initBtn = true;
		}
	}
	componentDidMount() {
		// 监控撤销删除组件操作 ctrl + z
	}
	onSubmit(e) {
		e.preventDefault();
		e.stopPropagation();
		const { deleteComponent, options, btnArr } = this.state;
		const { form, onUpdateConfigs, formItemConfig } = this.props;
		form.validateFields((err, values) => {
	        if (!err) {
				const newFormItemConfig = Object.assign({}, formItemConfig, values);
				if (deleteComponent) {
					newFormItemConfig.deleteFlag = true;
				}
				if (newFormItemConfig.type === 'Select') {
					const newOptions = options.slice();
					newOptions.forEach((item) => {
						const { index } = item;
						const kText = `optionText-${index}`;
						const kValue = `optionValue-${index}`;
						item.optionText = values[kText];
						item.optionValue= values[kValue];
						delete values[kText];
						delete values[kValue];
					});
					newFormItemConfig.options = newOptions;
				} else if (newFormItemConfig.type === 'DatePicker') {
					newFormItemConfig.defaultValue = values.defaultValue.format('YYYY-MM-DD');
				} else if (newFormItemConfig.type === 'Btn') {
					const newBtnArr = btnArr.slice();
					newBtnArr.forEach((item) => {
						const { index } = item;
						const btnText = `btnText-${index}`;
						const btnType = `type-${index}`;
						item.btnText = values[btnText];
						item.type= values[btnType];
						delete values[btnText];
						delete values[btnType];
					});
					newFormItemConfig.btnArr = newBtnArr;
				}
				onUpdateConfigs(newFormItemConfig);
	        }
	      },
	    );
	}
	onDeleteComponent() {
		this.setState({
			deleteComponent: true,
		});
	}
	onAddOptionItem() {
		const { options = [] } = this.state;
		const newOptions = options.slice();
		newOptions.push({
			value: '',
			text: '',
			index: this.optionIndex,
		});
		this.setState({
			options: newOptions,
		});
		this.optionIndex += 1;
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
	onDeleteOptionItem(index) {
		const { options = [] } = this.state;
		const newOptions = options.reduce((arr, item) => {
			if (item.index !== index) {
				arr.push(item);
			}
			return arr;
		}, []);
		this.setState({
			options: newOptions,
		});
	}
	renderOptionsCard() {
		const { form } = this.props;
		const { options } = this.state;
		return (
			<Card
				title="option设置"
				extra={<Icon type="plus-circle" onClick={this.onAddOptionItem} />}
			>
				{
					options.map(({ value, text, index }) => {
						return (
							<Fragment key={`optionitem-${index}`}>
								<Form.Item
									key={`optionitem-value-${index}`}
									style={{ width: '45%', display: 'inline-block' }} 
								>
									{form.getFieldDecorator(`optionValue-${index}`, {
										initialValue: value,
									})(
										<Input placeholder="value" />
									)}
								</Form.Item>
								<Form.Item
									key={`optionitem-text-${index}`}
									style={{ width: '45%', display: 'inline-block', marginLeft: '10px' }} 
								>
									{form.getFieldDecorator(`optionText-${index}`, {
										initialValue: text,
									})(
										<Input placeholder="show text" />
									)}
								</Form.Item>
								<Icon
									type="close-circle"
									style={{ marginLeft: '6px', lineHeight: '39px' }}
									onClick={() => {
										this.onDeleteOptionItem(index);
									}}
								/>
							</Fragment>
						);
					})
				}
			</Card>
		);
	}
	renderBtnCard() {
		const { formItemConfig, form } = this.props;
		const { type } = formItemConfig;
		const { btnArr } = this.state;
		if (type === 'Btn') {
			return (
				<Card
					title="按钮区域"
					extra={
						<Icon type="plus-circle" onClick={this.onAddButton} />
					}
				>
					{
						btnArr.map((item) => {
							const { index, btnText, type } = item;
							return (
								<Fragment key={`btn-${index}`}>
									<Form.Item
										key={`btnText-${index}`}
										style={{ width: '45%', display: 'inline-block' }} 
									>
										{form.getFieldDecorator(`btnText-${index}`, {
											initialValue: btnText,
										})(
											<Input placeholder="btnText" />
										)}
									</Form.Item>
									<Form.Item
										key={`type-${index}`}
										style={{ width: '45%', display: 'inline-block', marginLeft: '10px' }} 
									>
										{form.getFieldDecorator(`type-${index}`, {
											initialValue: type,
										})(
											<Select>
												<Option value="primary">primary</Option>
												<Option value="dashed">dashed</Option>
												<Option value="danger">danger</Option>
												<Option value="">none</Option>
											</Select>
										)}
									</Form.Item>
									<Icon
										type="close-circle"
										style={{ marginLeft: '6px', lineHeight: '39px' }}
										onClick={() => {
											this.onDeleteButton(index);
										}}
									/>
									<Divider />
								</Fragment>
							);
						})
					}
				</Card>
			);
		}
		return null;
	}
	renderDefaultValueItem() {
		const { formItemConfig, form } = this.props;
		const { type, defaultValue } = formItemConfig;
		const { getFieldDecorator } = form;
		const { options } = this.state;
		if (type === 'Select') {
			return (
				<Form.Item {...formItemLayout} label="defaultValue">
					{getFieldDecorator('defaultValue', {
						initialValue: defaultValue,
					})(
						<Select>
						{
							options.map((item) => {
								const { index } = item;
								const optionValue = form.getFieldValue(`optionValue-${index}`);
								const optionText = form.getFieldValue(`optionText-${index}`);
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
		} else {
			return null;
		}
	}
	renderContent() {
		const { deleteComponent } = this.state;
		const { form, dropComponent = false, formItemConfig } = this.props;
		const { label, name, placeholder, type } = formItemConfig;
		const { getFieldDecorator } = form;
		if (dropComponent && !deleteComponent) {
			if (type === 'Btn') {
				return this.renderBtnCard();
			}
			return (<Fragment>
				<Divider>组件</ Divider>
				<Form.Item {...formItemLayout} label="label">
					{getFieldDecorator('label', {
						initialValue: label,
					})(
						<Input />
					)}
				</Form.Item>
				<Form.Item {...formItemLayout} label="name">
					{getFieldDecorator('name', {
						initialValue: name,
					})(
						<Input />
					)}
				</Form.Item>
				{this.renderDefaultValueItem()}
				<Form.Item {...formItemLayout} label="placeholder">
					{getFieldDecorator('placeholder', {
						initialValue: placeholder,
					})(
						<Input />
					)}
				</Form.Item>
				{
					type === 'Select' ? 
						this.renderOptionsCard() : null
				}
				<Form.Item style={{ textAlign: 'center' }}>
					<Button onClick={this.onDeleteComponent}>
						删除组件
					</Button>
				</Form.Item>
			</Fragment>);
		}
		return null;
	}
	render() {
		const { visible, onClose, onDeleteFormItemContainer } = this.props;
		return (
			<Drawer
				visible={visible}
				title="编辑表单项"
				onClose={() => {
					this.setState({
						deleteComponent: false,
					});
					this.initOptions = false;
					this.initBtn = false;
					onClose();
				}}
				width={420}
			>
				<Form onSubmit={this.onSubmit}>
				<Divider>单元格</ Divider>
					<div className="btn-box">
						<Button onClick={onDeleteFormItemContainer}>
							删除单元格
						</Button>
					</div>
                    {
                        this.renderContent()
                    }
			        <div className="btn-bottom-box">
						<Button type="primary" htmlType="submit">
							保存
						</Button>
			        </div>
		    	</Form>
	    	</Drawer>
	    );
	}
}

export default Form.create()(FormItemEdit);