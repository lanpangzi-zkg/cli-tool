const layoutConfig = [{
    configs: {
        // colSpanArr: [8, 8, 8],
        formItemArr: [{
            colIndex: 0, colSpan: 8, type: 'Input', label: '姓名', name: 'name-0',
        }, {
            colIndex: 1,
            colSpan: 8,
            type: 'Select',
            label: '类型',
            name: 'name-1',
            defaultValue: 1,
            options: [{
                optionValue: 1,
                optionText: 'a',
            }, {
                optionValue: 2,
                optionText: 'b',
            }],
        }, {
            colIndex: 2, colSpan: 8, type: 'DatePicker', label: '日期', name: 'name-2',
        }, {
            colIndex: 3, colSpan: 8, type: 'Input', label: '编号', name: 'name-3',
        }, {
            colIndex: 4,
            colSpan: 8,
            type: 'Btn',
            singleRow: true, // 是否单独占据一行
            btnArr: [{
                btnText: '确定',
                index: 0,
                props: {
                    htmlType: 'submit',
                    type: 'primary',
                },
            }, {
                btnText: '隐藏',
                index: 1,
                expandFlag: true,
                expand: false, // 默认隐藏
                expandCount: 3,
            }],
            style: {
                textAlign: 'right',
            },
        }],
    },
    layoutColumn: 3,
    layoutIndex: 0,
    type: 'FormContainer',
}, {
    configs: {
        pagination: {
            pageSize: 10,
        },
        rowSelection: {
            type: 'checkbox',
        },
        rowKey: 'dataIndex0',
        columns: [{
            title: "column0", dataIndex: "dataIndex0", index: 0,
        }, {
            title: "column1", dataIndex: "dataIndex1", index: 1,
        }, {
            title: "column2", dataIndex: "dataIndex2", index: 2,
        }, {
            title: "column3", dataIndex: "dataIndex3", index: 3,
        }, {
            title: "操作",
            dataIndex: "dataIndex4",
            index: 4,
            btnArr: [{
                btnText: '删除',
                index: 1,
            }],
        }],
    },
    layoutIndex: 2,
    type: 'TableContainer',
}];

export default layoutConfig;