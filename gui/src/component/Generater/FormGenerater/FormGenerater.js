import React from 'react';
import { Form, Row, Col } from 'antd';
import Editable from '../../Core/Editable';
import './formGenerater.css';

class FormGenerater extends React.PureComponent {
    constructor(props) {
        super(props);
        const { column = 3 } = props;
        this.rowSpan = 24 / column || 8;
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.freshPage !== this.props.freshPage && nextProps.freshPage) {
            this.handleSubmit();
        }
    }
    componentDidMount() {
        const { defaultSubmit = false } = this.props;
        defaultSubmit && this.handleSubmit();
    }
    renderForm = () => {
        const { formConfig, column = 3 } = this.props;
        if (Array.isArray(formConfig)) {
            let i = 0;
            let renderdRowArr = [];
            // 分行渲染
            while(i < formConfig.length) {
                renderdRowArr = renderdRowArr.concat(this.renderRow(formConfig.slice(i, i + column), i / column));
                i += column;
            }
            return renderdRowArr;
        }
        return null;
    };
    
    renderRow = (rowConfig, index) => {
        if (Array.isArray(rowConfig)) {
            return (
                <Row
                    key={`row-${index}`}
                    gutter={{ md: 8, lg: 24, xl: 48 }}
                >
                    {
                        rowConfig.map((rowEntry, i) => {
                            return this.renderCol(rowEntry, i);
                        })
                    }
                </Row>
            );
        }
        return null;
    };
    
    renderCol = (colConfig, index) => {
        const md = colConfig.md || 8;
        // 按钮区域
        if (colConfig.btnArea && Array.isArray(colConfig.btnArea)) {
            return (
                <Col
                    key={`col-btnArea-${index}`}
                    span={colConfig.span || this.rowSpan}
                    style={colConfig.style}
                    md={md} sm={24}
                >
                    <Form.Item>
                        {
                            colConfig.btnArea.map((btnEntry, i) => {
                                return this.renderBtn(btnEntry, `${index}-${i}`);
                            })
                        }
                    </Form.Item>
                </Col>
            );
        }
        const { getFieldDecorator } = this.props.form;
        const editProps = {
            getFieldDecorator,
            colConfig,
            rowSpan: this.rowSpan,
        };
        return (
            <Editable key={`col-${index}`} {...editProps} onEdit={this.props.onEdit} />
        );
    };

    handleSubmit = (e) => {
        e && e.preventDefault();
    }

    render() {
        return (
            <Form
                onSubmit={this.handleSubmit}
                layout="inline"
            >
                {this.renderForm()}
            </Form>
        );
    }
}

export default Form.create()(FormGenerater);