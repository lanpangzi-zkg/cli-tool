import React, { PureComponent } from 'react';
import { Icon, message } from 'antd';
import DragRender from '../../Core/DragRender';
import FormItemEdit from '../../EditDrawer/FormItemEdit';
import { activeColor } from '../../common/Constants';
import './index.css';

const clsName = 'form-drop-container';
const forbiddenDropType = ['Breadcrumb', 'Text', 'Tabs'];

class FormItemContainer extends PureComponent {
    constructor(props) {
        super(props);
        const { configs } = props;
        const { formItemArr } = configs;
        const formItemConfig = formItemArr.find((formItem) => {
            return formItem.colIndex === props.colIndex;
        });
        this.state = {
            dropComponent: formItemConfig ? true : false, // 是否放入了组件
            formItemConfig: Object.assign({}, {
                colSpan: props.colSpan,
                colIndex: props.colIndex,
                originSpan: props.originSpan,
                cellStyles: props.cellStyles || {},
            }, formItemConfig || {}), // 组件配置信息
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
        if (nextProps.colSpan !== this.props.colSpan || nextProps.colIndex !== this.props.colIndex) {
            const newformItemConfig = Object.assign({},
                this.state.formItemConfig, {
                    colSpan: nextProps.colSpan,
                    colIndex: nextProps.colIndex,
                    originSpan: nextProps.originSpan,
                    cellStyles: nextProps.cellStyles,
                });
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
            this.resetBg();
            const data = JSON.parse(event.dataTransfer.getData('text/plain'));
            const { type } = data;
            if (~forbiddenDropType.indexOf(type)) {
                message.warn('当前容器不支持拖拽的组件!');
                return;
            }
            const { colIndex, onUpdateConfigs } = this.props;
            const formItemConfig = {
                type,
                colSpan: this.props.colSpan,
                originSpan: this.props.originSpan,
                cellStyles: this.props.cellStyles,
                label: type,
                name: `name-${colIndex}`,
                colIndex,
            };
            if (type === 'Button') {
                delete formItemConfig.label;
                delete formItemConfig.name;
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
        }
    }
    /**
     * @desc  删除单元格
     * @param {object} e 
     */
    onDeleteCol(e) {
        e && e.stopPropagation();
        const { onUpdateConfigs, colIndex } = this.props;
        const { formItemConfig } = this.state;
        this.setState({
            formItemConfig: {
                colSpan: formItemConfig.colSpan,
                originSpan: formItemConfig.originSpan,
                colIndex,
            },
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
    onDragLeave(event) {
        if (event.target.className === clsName) {
            event.target.style.background = '';
        }
    }
    componentWillUnmount() {
        if (this.targetDom) {
            this.targetDom.removeEventListener('drop', this.onDrop);
            this.targetDom.removeEventListener('dragleave', this.onDragLeave);
            this.targetDom.removeEventListener("dragenter", this.onDragenter);
        }
    }
    componentDidMount() {
        if (!this.targetDom) {
            return;
        }
        this.targetDom.addEventListener("drop", this.onDrop, false);
        this.targetDom.addEventListener("dragleave", this.onDragLeave, false);
        this.targetDom.addEventListener("dragenter", this.onDragenter, false);
    }
    onUpdateConfig(config) {
        const { formItemConfig } = this.state;
        let newformItemConfig = null;
        // 删除单元格内的组件
        if (config.deleteFlag) {
            newformItemConfig = {
                colIndex: config.colIndex,
                colSpan: config.colSpan,
                originSpan: config.originSpan,
                cellStyles: config.cellStyles,
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
        const { layoutColumn, onDeleteFormItemContainer, colIndex, configs } = this.props;
        const colIndexNum = + colIndex;
        const _colSpan = Object.hasOwnProperty.call(formItemConfig, 'colSpan') ? 
            formItemConfig.colSpan : (24 / layoutColumn);
        return (
            <div
                className={clsName}
                style={{
                    width: this.getContainerWidth(_colSpan, layoutColumn),
                }}
                ref={(targetDom) => { this.targetDom = targetDom; }}
            >
                {
                  dropComponent ? (
                        <DragRender
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
                    colSpanArr={configs.colSpanArr}
                    formItemArr={configs.formItemArr}
                    dropConfig={formItemConfig}
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