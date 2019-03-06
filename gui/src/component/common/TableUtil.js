import React, { Fragment } from 'react';
import { Divider, Dropdown, Icon } from 'antd';
import { TRUE } from './Constants';

const renderMoreOpList = (opList) => {
    return (
        <span style={{ background: '#fff', display: 'block' }}>
            {
                opList.map(({opText, index}) => {
                return (
                    <a href="&nbsp;" key={`op-${index}`} style={{ display: 'block' }}>
                        {opText}
                    </a>
                );
                })
            }
        </span>
    );
}

const renderMultOperation = (operationArr) => {
    const [ firstItem, ...restItemArr ] = operationArr;
    return (
        <Fragment>
            <a href="&nbsp;">
                {firstItem.opText}
            </a>
            <Divider type="vertical" />
            <Dropdown overlay={renderMoreOpList(restItemArr)}>
                <a className="ant-dropdown-link" href="&nbsp;">
                    更多<Icon type="down" />
                </a>
            </Dropdown>
        </Fragment>
    );
}
const renderNormalOperation = (operationArr) => {
    const resultArr = [];
    operationArr.forEach(({ opText, index }, i) => {
        resultArr.push((
            <Fragment key={`fr-${index}`}>
                <a href="&nbsp;" key={`op-${index}`}>{opText}</a>
                {
                    i !== operationArr.length -1
                        ? <Divider type="vertical" /> : null
                }
            </Fragment>)
        );
    });
    return resultArr;
}

const handleOperation = (configs) => {
    const { hasOperation, operationArr = [], columns } = configs;
    const copyColumns = columns.slice();
    if (copyColumns.length > 0 && copyColumns[copyColumns.length -1].title === '操作') {
        copyColumns.pop();
    }
    if (hasOperation === TRUE) {
        copyColumns.push({
            title: '操作',
            render: () => {
                if (!Array.isArray(operationArr)) {
                    return null;
                }
                if (operationArr.length > 2) {
                    return (
                        <span>
                            {
                                renderMultOperation(operationArr)
                            }
                        </span>
                    );
                } else {
                    return (
                        <span>
                            {
                                renderNormalOperation(operationArr)
                            }
                        </span>
                    );
                }
            },
        });
    }
    configs.columns = copyColumns;
    return configs;
}

export default handleOperation;