/**
 * @desc 页面右侧容器视图
 */
import React, { PureComponent, Fragment } from 'react';
import LayoutContainer from '../LayoutContainer';
import defaultColumns from '../configs/defaultColumns';
import { FORM_CONTAINER, TABLE_CONTAINER } from '../common/Constants';
import './index.css';
import { message, Button } from 'antd';

const clsArr = ['main-container', 'empty-tips'];

class MainContainer extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			layoutConfig: [],
			generateLoading: false, // 页面是否在生成
		};
		this.onEdit = this.onEdit.bind(this);
		this.onUpdateLayoutConfig = this.onUpdateLayoutConfig.bind(this);
		this.onGeneratePage = this.onGeneratePage.bind(this);
		this.layoutIndex = 0;
	}
	onUpdateLayoutConfig({ layoutIndex, configs, deleteFlag = false }) {
		const { layoutConfig } = this.state;
		const copyConfig = layoutConfig.slice();
		// 删除配置文件
		if (deleteFlag) {
			const deleteIndex = copyConfig.findIndex((item) => {
				return item.layoutIndex === layoutIndex;
			});
			copyConfig.splice(deleteIndex, 1);
		} else {
			const updateConfigItem = copyConfig.find((item) => {
				return item.layoutIndex === layoutIndex;
			});
			updateConfigItem.configs = configs;
		}
		this.setState({
			layoutConfig: copyConfig,
		});
	}
	componentDidMount() {
		if (window.ipc && window.ipc.on) {
            window.ipc.on('asynchronous-reply', (event, arg) => {
				const { code, info } = JSON.parse(arg);
				if (code === 1) {
					message.success(info);
				} else {
					message.error(info);
				}
				this.setState({
					generateLoading: false,
				});
            });
        }
		document.addEventListener("drop", (event) => {
			event.preventDefault();
			const cls = event.target.className;
	        if (clsArr.indexOf(cls) > -1) {
	        	const data = JSON.parse(event.dataTransfer.getData('text/plain'));
				const { type } = data;
				if (type === FORM_CONTAINER || type === TABLE_CONTAINER) {
					const { layoutConfig } = this.state;
					const copyLayoytConfig = layoutConfig.slice();
					const configObj = Object.assign(data, {
						layoutIndex: this.layoutIndex,
						configs: {},
					});
					if (type === TABLE_CONTAINER) {
						configObj.configs.columns = defaultColumns;
					}
					copyLayoytConfig.push(configObj);
					this.setState({
						layoutConfig: copyLayoytConfig,
					});
					this.layoutIndex += 1;
				} else {
					message.warn('请拖拽容器组件');
				}
	        }
		}, false);
	}
	onEdit(values) {
		const { kIndex } = values;
		const { formConfig } = this.state;
		const copyFormConfig = formConfig.slice();
		copyFormConfig[kIndex] = Object.assign({}, copyFormConfig[kIndex], values);
		this.setState({
			formConfig: copyFormConfig,
		});
	}
	onGeneratePage() {
		const { pageName } = this.props;
		const { layoutConfig } = this.state;
        const pageConfig = {
			pageName,
			layoutConfig,
		};
		this.setState({
			generateLoading: true,
		});
        window.ipc.send('asynchronous-message', JSON.stringify(pageConfig));
    }
	render() {
		const { layoutConfig, generateLoading } = this.state;
		return (
			<Fragment>
				<div className="main-container">
					<LayoutContainer
						layoutConfig={layoutConfig}
						onUpdateLayoutConfig={this.onUpdateLayoutConfig}
					/>
				</div>
				<Button
					type="primary"
					onClick={this.onGeneratePage}
					loading={generateLoading}
				>
					生成页面
				</Button>
			</Fragment>
		);
	}
}

export default MainContainer;