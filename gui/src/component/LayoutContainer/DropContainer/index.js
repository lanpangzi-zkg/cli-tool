import React, { PureComponent, Fragment } from 'react';
import { Icon, message } from 'antd';
import DropRender from './DropRender';
import DropAreaEdit from '../../EditDrawer/DropAreaEdit';
import { activeColor } from '../../common/Constants';
import './index.css';

const clsName = 'drop-container';

class DropContainer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dropConfig: {},
            showEdit: false,
            dropComponent: false,
        };
        this.onUpdateConfigs = this.onUpdateConfigs.bind(this);
        this.onToggleEdit = this.onToggleEdit.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }
    componentDidMount() {
        if (!this.DropDom) {
            return;
        }
        this.DropDom.addEventListener("drop", this.onDrop, false);
        this.DropDom.addEventListener("dragenter", this.onDragenter, false);
    }
    componentWillUnmount() {
        if (this.DropDom) {
            this.DropDom.removeEventListener('drop', this.onDrop);
            this.DropDom.removeEventListener("dragenter", this.onDragenter);
        }
    }
    onToggleEdit() {
        this.setState({
            showEdit: !this.state.showEdit,
        });
    }
    onUpdateConfigs({ deleteFlag = false, ...dropConfig }) {
        const { onUpdateConfigs } = this.props;
        const newState = {
            dropConfig,
        };
        // 删除组件
        if (deleteFlag) {
            newState.dropConfig = {
                dropIndex: dropConfig.dropIndex,
            };
            newState.dropComponent = false;
        }
        this.setState({
            ...newState,
        });
        dropConfig.deleteFlag = deleteFlag;
        onUpdateConfigs(dropConfig);
        this.onToggleEdit();
    }
    onDrop(event) {
        event.preventDefault();
        const { allowDropType = [] } = this.props;
        if (event.target.className === clsName) {
            this.resetBg();
            const data = JSON.parse(event.dataTransfer.getData('text/plain'));
            const { type } = data;
            if (!~allowDropType.indexOf(type)) {
                message.warn('当前容器不支持拖拽的组件!');
                return;
            }
            const { dropIndex, onUpdateConfigs } = this.props;
            const dropConfig = {
                type,
                dropIndex,
            };
            if (type === 'Text') {
                dropConfig.text = 'Text';
            }
            if (type === 'Breadcrumb') {
                dropConfig.breadcrumbArr = [
                    {index: 0, label: 'menu1', value: '' },
                    {index: 1, label: 'menu2', value: '' },
                ];
            }
            if (type === 'Button') {
                dropConfig.type = 'Btn';
                dropConfig.btnArr = [{
                    btnText: 'button',
                    type: 'primary',
                    index: 0,
                }];
            }
            if (type === 'Tabs') {
                dropConfig.tabsArr = [{
                    label: 'tab1',
                    value: 'tab1',
                    index: 0,
                }];
            }
            this.setState({
                dropConfig,
                dropComponent: true,
            }, () => {
                onUpdateConfigs(dropConfig);
            });
        }
    }
    resetBg() {
        const dropDomArr = document.querySelectorAll(`.${clsName}`);
        if (dropDomArr) {
            dropDomArr.forEach((item) => {
                item.style.background = '';
            });
        }
    }
    onDragenter(event) {
        if (event.target.className === clsName) {
            event.target.style.background = activeColor;
        }
    }
    render() {
        const { dropComponent, dropConfig, showEdit } = this.state;
        return (
            <div
                className="drop-container"
                ref={(DropDom) => { this.DropDom = DropDom; }}
            >
                {
                  dropComponent ? (
                    <Fragment> 
                        <DropRender
                            {...this.props}
                            dropConfig={dropConfig}
                        />
                        <Icon
                            type="bars"
                            className="icon-operation"
                            onClick={this.onToggleEdit}
                        />
                    </Fragment>
                    ) : null
                }
                <DropAreaEdit
                    visible={showEdit}
                    dropConfig={dropConfig}
                    inForm={false}
                    onClose={this.onToggleEdit}
                    onUpdateConfigs={this.onUpdateConfigs}
                />
            </div>
        );
    }
}

export default DropContainer;