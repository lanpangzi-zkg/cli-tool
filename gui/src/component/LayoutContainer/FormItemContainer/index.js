import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import Editable from '../../Core/Editable';
import FormItemEdit from '../../EditDrawer/FormItemEdit';
import { activeColor } from '../../common/Constants';
import './index.css';

const clsName = 'drop-container';

class FormItemContainer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dropComponent: false, // 是否放入了组件
            formItemConfig: { colSpan: props.colSpan }, // 组件配置信息
            visible: false,
        };
        this.onUpdateConfig = this.onUpdateConfig.bind(this);
        this.onShowEditItem = this.onShowEditItem.bind(this);
        this.onEditDropContainer = this.onEditDropContainer.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onDeleteCol = this.onDeleteCol.bind(this);
        this.onClose = this.onClose.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.colSpan !== this.props.colSpan) {
            const newformItemConfig = Object.assign({},
                this.state.formItemConfig, { colSpan: nextProps.colSpan });
            this.setState({
                formItemConfig: newformItemConfig,
            });
        }
    }
    onShowEditItem() {
        this.setState({
            visible: true,
        });
    }
    onDrop(event) {
        event.preventDefault();
        if (event.target.className === clsName) {
            const data = JSON.parse(event.dataTransfer.getData('text/plain'));
            const { type } = data;
            const { colIndex, onUpdateConfigs } = this.props;
            const formItemConfig = {
                type,
                colSpan: this.props.colSpan,
                label: 'label',
                name: `name-${colIndex}`,
                colIndex,
            };
            if (type === 'Button') {
                delete formItemConfig.label;
                delete formItemConfig.name;
                delete formItemConfig.colSpan;
                formItemConfig.type = 'Btn';
                formItemConfig.btnArr = [{
                    btnText: 'button',
                    type: 'primary',
                    index: 0,
                }];
            }
            this.setState({
                formItemConfig,
                dropComponent: true,
            }, () => {
                onUpdateConfigs(formItemConfig);
            });
            this.resetBg();
        }
    }
    /**
     * @desc  删除col组件配置项
     * @param {object} e 
     */
    onDeleteCol(e) {
        e && e.stopPropagation();
        const { onUpdateConfigs, colIndex } = this.props;
        const { formItemConfig } = this.state;
        this.setState({
            formItemConfig: { colSpan: formItemConfig.colSpan },
            dropComponent: false,
        });
        onUpdateConfigs({ colIndex, deleteFlag: true });
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
    componentWillUnmount() {
        if (this.targetDom) {
            this.targetDom.removeEventListener('drop', this.onDrop);
            this.targetDom.removeEventListener("dragenter", this.onDragenter);
        }
    }
    componentDidMount() {
        if (!this.targetDom) {
            return;
        }
        this.targetDom.addEventListener("drop", this.onDrop, false);
        this.targetDom.addEventListener("dragenter", this.onDragenter, false);
    }
    onUpdateConfig(config) {
        const { formItemConfig } = this.state;
        let newformItemConfig = null;
        if (config.deleteFlag) {
            newformItemConfig = {
                colIndex: config.colIndex,
                colSpan: config.colSpan,
            }
        } else {
            newformItemConfig = Object.assign({}, formItemConfig, config);
        }
        this.setState({
            formItemConfig: newformItemConfig,
            dropComponent: !config.deleteFlag,
        }, () => {
            const { onUpdateConfigs } = this.props;
            onUpdateConfigs(newformItemConfig);
            this.onClose();
        });
    }
    onEditDropContainer(e) {
        if (e.target.className === clsName) {
            e && e.stopPropagation();
            this.setState({
                visible: true,
            });
        }
    }
    onClose() {
        this.setState({
            visible: false,
        });
    }
    getContainerWidth(colSpan = 8) {
        return `${100 * colSpan / 24 }%`;
    }
    render() {
        const { dropComponent, formItemConfig = {}, visible } = this.state;
        const { layoutColumn, onDeleteFormItemContainer, colIndex } = this.props;
        const colIndexNum = + colIndex;
        const colSpan = (formItemConfig && formItemConfig.colSpan) || 24 / layoutColumn;
        return (
            <div
                className={clsName}
                style={{
                    width: this.getContainerWidth(colSpan, layoutColumn),
                }}
                ref={(targetDom) => { this.targetDom = targetDom; }}
            >
                {
                  dropComponent ? (
                        <Editable
                            {...this.props}
                            formItemConfig={formItemConfig}
                        />
                    ) : null
                }
                <Icon
                    type="bars"
                    className="icon-operation"
                    onClick={this.onShowEditItem}
                />
                <FormItemEdit
                    visible={visible}
                    onDelete={this.onDeleteCol}
                    onUpdateConfigs={this.onUpdateConfig}
                    formItemConfig={formItemConfig}
                    dropComponent={dropComponent}
                    layoutColumn={layoutColumn}
                    onDeleteFormItemContainer={() => {
                        this.setState({
                            visible: false,
                        }, () => {
                            onDeleteFormItemContainer(colIndexNum);
                        });
                    }}
                    onClose={this.onClose}
                />
            </div>
        );
    }
}

export default FormItemContainer;