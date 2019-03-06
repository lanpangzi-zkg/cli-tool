import React, { Fragment } from 'react';
import { Button, Collapse, Card, Drawer, Divider, Select, Input, Icon, Form } from 'antd';
import BaseEdit from '../../Core/BaseEdit';
import { objToStr } from '../../common/CellUtil';
import formItemLayout from '../../configs/layout';
import { TRUE } from '../../common/Constants';
import './index.css';

const Panel = Collapse.Panel;
const Option = Select.Option;
const { TextArea } = Input;

class FormItemEdit extends BaseEdit {
	getItemSetType() {
		return ['Select', 'Btn', 'Radio', 'Checkbox'];
	}
	constructor(props) {
		super(props);
		this.state = {
			selectArr: [],
			radioArr: [],
			checkboxArr: [],
			btnArr: [],
		};
		this.onAddCellStyleItem = this.onAddCellStyleItem.bind(this);
		this.onDeleteCellStyleItem = this.onDeleteCellStyleItem.bind(this);
	}
	onAddCellStyleItem() {
		const { cellStyles = [] } = this.state;
		const newCellStyles = cellStyles.slice();
		newCellStyles.push({
			value: '',
			name: '',
			index: this.cellStyleIndex,
		});
		this.setState({
			cellStyles: newCellStyles,
		});
		this.cellStyleIndex += 1;
	}
	onDeleteCellStyleItem(index) {
		const { cellStyles = [] } = this.state;
		const newCellStyles = cellStyles.reduce((arr, item) => {
			if (item.index !== index) {
				arr.push(item);
			}
			return arr;
		}, []);
		this.setState({
			cellStyles: newCellStyles,
		});
	}
	renderBtnCard() {
		const { dropConfig, form } = this.props;
		const { type } = dropConfig;
		const { btnArr, expandFlag = '0' } = this.state;
		if (type === 'Btn') {
			return (
				<Card
					title="按钮区域"
					extra={
						<Icon type="plus-circle" onClick={this.onAddButton} />
					}
				>
					<Collapse>
					{
						btnArr.map((item) => {
							const { index, btnText, type, htmlType = 'button',
								onClick, expandCount, btnStyle } = item;
							return (
								<Panel header={this.renderBtnPanelHeader(item)} key={`btn-${index}`}>
									<Form.Item
										key={`btnText-${index}`}
										label="按钮文字"
										{...formItemLayout}
									>
										{form.getFieldDecorator(`btnText-${index}`, {
											initialValue: btnText,
										})(
											<Input placeholder="btnText" />
										)}
									</Form.Item>
									<Form.Item
										key={`type-${index}`}
										label="type"
										{...formItemLayout}
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
									<Form.Item
										key={`htmlType-${index}`}
										label="htmlType"
										{...formItemLayout}
									>
										{form.getFieldDecorator(`htmlType-${index}`, {
											initialValue: htmlType,
										})(
											<Select>
												<Option value="submit">submit</Option>
												<Option value="reset">reset</Option>
												<Option value="button">button</Option>
											</Select>
										)}
									</Form.Item>
									<Form.Item
										key={`onClick-${index}`}
										label="onClick"
										{...formItemLayout}
									>
										{form.getFieldDecorator(`onClick-${index}`, {
											initialValue: onClick,
										})(
											<Input placeholder="点击事件名称" />
										)}
									</Form.Item>
									<Form.Item
										key={`btnStyle-${index}`}
										label="按钮样式"
										{...formItemLayout}
									>
										{form.getFieldDecorator(`btnStyle-${index}`, {
											initialValue: btnStyle,
										})(
											<TextArea placeholder="多个样式属性请用分号分隔" />
										)}
									</Form.Item>
									<Form.Item
										key={`expandFlag-${index}`}
										label="折叠"
										{...formItemLayout}
									>
										{form.getFieldDecorator(`expandFlag-${index}`, {
											initialValue: expandFlag,
										})(
											<Select>
												<Option value="0">否</Option>
												<Option value="1">是</Option>
											</Select>
										)}
									</Form.Item>
									{
										form.getFieldValue(`expandFlag-${index}`) === '1' ?
											(<Form.Item
												key={`expandCount-${index}`}
												label="折叠可见数"
												{...formItemLayout}
											>
												{form.getFieldDecorator(`expandCount-${index}`, {
													initialValue: expandCount,
												})(
													<Input placeholder="expandCount" />
												)}
											</Form.Item>) : null
									}
								</Panel>
							);
						})
					}
					</Collapse>
					<Form.Item style={{ textAlign: 'center' }}>
						<Button onClick={this.onDeleteComponent}>
							删除组件
						</Button>
					</Form.Item>
				</Card>
			);
		}
		return null;
	}
	renderLinkage(dropConfig, formItemArr) {
		const { condition, linkName } = dropConfig;
		const { getFieldDecorator } = this.props.form;
		return (
			<Fragment>
				<Form.Item {...formItemLayout} label="关联组件name">
					{getFieldDecorator('linkName', {
						initialValue: linkName,
					})(
						<Select>
							{
								formItemArr.map(({ name, colIndex, label }) => {
									if (name && colIndex !== dropConfig.colIndex) {
										return (<Option value={`${name}`}>{`${name}/${label}`}</Option>);
									}
									return null;
								})
							}
						</Select>
					)}
				</Form.Item>
				<Form.Item {...formItemLayout} label="condition">
					{getFieldDecorator('condition', {
						initialValue: condition,
					})(
						<Input />
					)}
				</Form.Item>
			</Fragment>
		);
	}
	renderDatePickerExtra(dropConfig) {
		const { showTime = false, format = 'YYYY-MM-DD' } = dropConfig;
		const { getFieldDecorator } = this.props.form;
		return (
			<Fragment>
					<Form.Item {...formItemLayout} label="showTime">
						{getFieldDecorator('showTime', {
							initialValue: showTime === TRUE ? '1' : '0',
						})(
							<Select>
								<Option value="1">是</Option>
								<Option value="0">否</Option>
							</Select>
						)}
					</Form.Item>
					<Form.Item {...formItemLayout} label="format">
						{getFieldDecorator('format', {
							initialValue: format,
						})(
							<Input />
						)}
					</Form.Item>
			</Fragment>
		);
	}
	renderContent() {
		const { deleteComponent } = this.state;
		const { form, dropComponent = false, dropConfig, formItemArr } = this.props;
		const { label, name, placeholder, type, linkage } = dropConfig;
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
				{
					type === 'DatePicker' || type === 'RangePicker' ? 
						this.renderDatePickerExtra(dropConfig) : null
				}
				{
					type === 'Radio' ? this.rendeRadio() : null
				}
				{
					type === 'Checkbox' ? this.rendeCheckbox() : null
				}
				{
					type === 'Select' ? this.renderSelect() : null
				}
				{this.renderDefaultValueItem()}
				<Form.Item {...formItemLayout} label="placeholder">
					{getFieldDecorator('placeholder', {
						initialValue: placeholder,
					})(
						<Input />
					)}
				</Form.Item>
				<Form.Item {...formItemLayout} label="联动关联">
					{getFieldDecorator('hasLinkage', {
						initialValue: linkage,
					})(
						<Select>
							<Option value="0">否</Option>
							<Option value="1">是</Option>
						</Select>
					)}
				</Form.Item>
				{
					form.getFieldValue('hasLinkage') === '1' ?
						this.renderLinkage(dropConfig, formItemArr) : null
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
	renderCellStylesSetting() {
		const { form } = this.props;
		const { cellStyles } = this.state;
		return (
			<Card
				title="style设置"
				extra={<Icon type="plus-circle" onClick={this.onAddCellStyleItem} />}
			>
				{
					cellStyles.map(({ name, value, index }) => {
						return (
							<Fragment key={`cell-styleitem-${index}`}>
								<Form.Item
									key={`cell-styleitem-name-${index}`}
									style={{ width: '45%', display: 'inline-block' }} 
								>
									{form.getFieldDecorator(`styleName-${index}`, {
										initialValue: name,
									})(
										<Input placeholder="style name" />
									)}
								</Form.Item>
								<Form.Item
									key={`cell-styleitem-value-${index}`}
									style={{ width: '45%', display: 'inline-block', marginLeft: '10px' }} 
								>
									{form.getFieldDecorator(`styleValue-${index}`, {
										initialValue: value,
									})(
										<Input placeholder="style value" />
									)}
								</Form.Item>
								<Icon
									type="close-circle"
									style={{ marginLeft: '6px', lineHeight: '39px' }}
									onClick={() => {
										this.onDeleteCellStyleItem(index);
									}}
								/>
							</Fragment>
						);
					})
				}
			</Card>
		);
	}
	render() {
		const { visible, onClose, form, onDeleteFormItemContainer,
			dropConfig, colSpanArr } = this.props;
		let initialColSpan = 1;
		let tempColSpan = dropConfig.colSpan;
		for (let i = 0; i < colSpanArr.length; i++) {
			tempColSpan -= colSpanArr[i].colSpan;
			if (tempColSpan > 0) {
				initialColSpan++;
			} else {
				i = colSpanArr.length;
			}
		}
		const initialCellStyles = objToStr(dropConfig.cellStyles);
		return (
			<Drawer
				visible={visible}
				title="编辑表单项"
				onClose={() => {
					this.onCloseEdit();
					onClose();
				}}
				width={420}
			>
				<Form onSubmit={this.handleSubmit}>
				<Divider>单元格</ Divider>
					<Form.Item
						style={{ padding: '0 24px' }}
						label="style设置"
					>
						{form.getFieldDecorator("cellStyles", {
							initialValue: initialCellStyles,
						})(
							<TextArea placeholder="多个样式属性请用分号分隔" />
						)}
					</Form.Item>
					<Form.Item key="cell-colSpan" label="跨列设置" style={{ padding: '0 24px' }}>
						{form.getFieldDecorator("originSpan", {
							initialValue: initialColSpan,
						})(
							<Select>
								{
									colSpanArr.map((c, i) => {
										return (
											<Option
												key={`${c}-${i}`}
												value={i+1}
											>
												{`${i+1}列`}
											</Option>
										);
									})
								}
							</Select>
						)}
					</Form.Item>
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