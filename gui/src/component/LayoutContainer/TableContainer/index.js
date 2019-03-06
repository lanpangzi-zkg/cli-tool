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
    getMockDataSource(columns, dataSize) {
        const ds = [];
        for (let i = 0; i < dataSize; i++) {
            const dsItem = {};
            columns.forEach((item) => {
                Object.keys(item).forEach((k) => {
                    dsItem[item.dataIndex] = `${item.dataIndex}-${i}`;
                });
            });
            ds.push(dsItem);
        }
        return ds;
    }
    render() {
        const { visible } = this.state;
        const { configs = {} } = this.props;
        const { pagination = false, rowSelection = null, columns, mockData } = configs;
        const copyColumns = columns.slice();
        const mockDataNum = (/^\d+$/).test(mockData) ? +mockData : 0;
        return (
            <div
                className="table-container container"
            >
                <Table
                    columns={copyColumns}
                    bordered
                    dataSource={this.getMockDataSource(columns, mockDataNum)}
                    pagination={pagination}
                    rowSelection={rowSelection}
                    onClick={this.onShowEditTable}
                />
                <TableEdit
                    visible={visible}
                    configs={configs}
                    onClose={this.onClose}
                    onDeleteContainer={this.onDeleteContainer}
                    onUpdateConfigs={this.onUpdateConfigs}
                />
                <Icon type="form" className="icon-operation" onClick={this.onShowEditTable} />
            </div>
        );
    }
}

export default TableContainer;