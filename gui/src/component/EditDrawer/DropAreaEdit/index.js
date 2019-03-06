import React, { Fragment } from 'react';
import { Button, Collapse, Card, Drawer, Select, Input, Icon, Form } from 'antd';
import BaseEdit from '../../Core/BaseEdit';
import { objToStr } from '../../common/CellUtil';
import formItemLayout from '../../configs/layout';
import './index.css';

const Panel = Collapse.Panel;
const Option = Select.Option;
const { TextArea } = Input;

class DropAreaEdit extends BaseEdit {
	getItemSetType() {
		return ['Tabs', 'Breadcrumb'];
	}
	renderBtnCard() {
		const { dropConfig, form } = this.props;
		const { type } = dropConfig;
		const { btnArr } = this.state;
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
								onClick, btnStyle } = item;
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
								</Panel>
							);
						})
					}
					</Collapse>
				</Card>
			);
		}
		return null;
	}
	renderContent() {
		const { form, dropConfig } = this.props;
		const { placeholder, type } = dropConfig;
		const { getFieldDecorator } = form;
		if (this.state.deleteComponent) {
			return null;
		}
		if (type === 'Btn') {
			return this.renderBtnCard();
		}
		if (type === 'Breadcrumb') {
			return this.renderBreadcrumb();
		}
		if (type === 'Tabs') {
			return this.renderTabs();
		}
		return (
			<Fragment>
				{this.renderDefaultValueItem()}
				{
					type !== 'Text' && type !== 'Breadcrumb' ?
						(<Form.Item {...formItemLayout} label="placeholder">
							{getFieldDecorator('placeholder', {
								initialValue: placeholder,
							})(
								<Input />
							)}
						</Form.Item>) : null
				}
			</Fragment>
		);
	}
	render() {
		const { visible, onClose, form, dropConfig } = this.props;
		const initialCellStyles = objToStr(dropConfig.cellStyles);
		return (
			<Drawer
				visible={visible}
				title="编辑组件"
				onClose={() => {
					this.onCloseEdit();
					onClose();
				}}
				width={420}
			>
				<Form onSubmit={this.handleSubmit}>
					<Form.Item label="style设置" {...formItemLayout}>
						{form.getFieldDecorator("cellStyles", {
							initialValue: initialCellStyles,
						})(
							<TextArea placeholder="多个样式属性请用分号分隔" />
						)}
					</Form.Item>
                    {
                        this.renderContent()
                    }
                    <div className="btn-box">
						<Button onClick={this.onDeleteComponent}>
							删除组件
						</Button>
					</div>
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

export default Form.create()(DropAreaEdit);