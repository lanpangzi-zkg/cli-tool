import React, { PureComponent } from 'react';
import DropContainer from '../DropContainer';
import BoxEdit from '../../EditDrawer/BoxEdit';
import { Icon } from 'antd';
import './index.css';

class BoxContainer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            configs: {
                cellsArr: [],
                layoutColumn: 0,
            },
        };
        this.onToggleEdit = this.onToggleEdit.bind(this);
        this.onDeleteContainer = this.onDeleteContainer.bind(this);
        this.onUpdateConfigs = this.onUpdateConfigs.bind(this);
    }
    onToggleEdit() {
        this.setState({
            visible: !this.state.visible,
        });
    }
    onDeleteContainer() {
        const { onUpdateLayoutConfig, layoutIndex } = this.props;
        onUpdateLayoutConfig({ layoutIndex, deleteFlag: true });
        this.onToggleEdit();
    }
    onUpdateConfigs({ deleteFlag = false, ...values }) {
        const { configs } = this.state;
        const newConfigs = Object.assign({}, configs);
        const { onUpdateLayoutConfig, layoutIndex } = this.props;
        const newCellsArr = newConfigs.cellsArr.reduce((arr, item) => {
            // 删除单元格内的组件
            if (deleteFlag) {
                if (values.dropIndex !== item.dropIndex) {
                    arr.push(Object.assign({}, item));
                } else {
                    arr.push({
                        dropIndex: values.dropIndex,
                    });
                }
            } else {
                if (values.dropIndex === item.dropIndex) {
                    arr.push(Object.assign({}, item, values));
                } else {
                    arr.push(Object.assign({}, item));
                }
            }
            return arr;
        }, []);
        newConfigs.cellsArr = newCellsArr;
        this.setState({
            configs: newConfigs,
        }, () => {
            onUpdateLayoutConfig({ layoutIndex, configs: newConfigs });
        });
    }
    rendeCell(layoutColumn) {
        if (!layoutColumn) {
            return null;
        }
        const componentArr = [];
        const width = `${100 / layoutColumn}%`;
        for (let i = 0; i < layoutColumn; i++) {
            componentArr.push((
               <div className="cell" key={`cell-${i}`} style={{ width }}>
                    < DropContainer
                        dropIndex={i}
                        allowDropType={['Text', 'Breadcrumb', 'Button', 'Tabs']}
                        onUpdateConfigs={this.onUpdateConfigs}
                    />
               </div>
            ));
        }
        return componentArr;
    }
    render() {
        const { visible } = this.state;
        const { onUpdateLayoutConfig, layoutIndex, configs } = this.props;
        const { layoutColumn = 0, boxStyles } = configs;
        return (
            <div className="fulu-cell-box preview-mode" style={boxStyles}>
                {
                    this.rendeCell(+layoutColumn)
                }
                <BoxEdit
                    visible={visible}
                    configs={configs}
                    onClose={(configs) => {
                        if (configs) {
                            const layoutConfig = {
                                layoutIndex,
                            };
                            const { layoutColumn } = configs;
                            const { cellsArr } = this.state.configs;
                            const newCellsArr = cellsArr.slice(0, layoutColumn);
                            for (let i = 0; i < layoutColumn; i++) {
                                if (newCellsArr.length <= i) {
                                    newCellsArr.push({
                                        dropIndex: i
                                    });
                                }
                            }
                            const newConfigs = {
                                cellsArr: newCellsArr,
                                layoutColumn,
                                boxStyles: configs.boxStyles,
                            };
                            layoutConfig.configs = newConfigs;
                            this.setState({
                                configs: newConfigs,
                            });
                            onUpdateLayoutConfig(layoutConfig);
                        }
                        this.onToggleEdit();
                    }}
                    onDeleteContainer={this.onDeleteContainer}
                />
                <Icon type="form" className="icon-operation" onClick={this.onToggleEdit} />
            </div>
        );
    }
}

export default BoxContainer;