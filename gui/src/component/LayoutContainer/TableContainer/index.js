import React, { PureComponent } from 'react';
import { Icon, Table } from 'antd';
import TableEdit from '../../EditDrawer/TableEdit';

import './index.css';

class TableContainer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
        this.onShowEditTable = this.onShowEditTable.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onUpdateConfigs = this.onUpdateConfigs.bind(this);
        this.onDeleteContainer = this.onDeleteContainer.bind(this);
    }
    onShowEditTable() {
        this.setState({
            visible: true,
        });
    }
    onClose(e) {
        e.stopPropagation();
        this.setState({
            visible: false,
        });
    }
    onUpdateConfigs(configs) {
        const { layoutIndex, onUpdateLayoutConfig } = this.props;
        onUpdateLayoutConfig({layoutIndex, configs});
        this.setState({
            visible: false,
        });
    }
    onDeleteContainer() {
        const { layoutIndex, onUpdateLayoutConfig } = this.props;
        onUpdateLayoutConfig({ layoutIndex, deleteFlag: true });
    }
    render() {
        const { visible } = this.state;
        const { configs = {} } = this.props;
        const { pagination = false, rowSelection = null } = configs;
        return (
            <div
                className="table-container container"
            >
                <Table
                    columns={configs.columns}
                    bordered
                    pagination={pagination}
                    rowSelection={rowSelection}
                    onClick={this.onShowEditTable}
                />
                <TableEdit
                    visible={visible}
                    configs={configs}
                    onClose={this.onClose}
                    onUpdateConfigs={this.onUpdateConfigs}
                />
                <Icon type="form" className="icon-operation" onClick={this.onShowEditTable} />
                <Icon type="close-circle" className="icon-operation" onClick={this.onDeleteContainer} />
            </div>
        );
    }
}

export default TableContainer;