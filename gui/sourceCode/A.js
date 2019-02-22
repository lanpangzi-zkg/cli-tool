import React, { Component } from 'react';
import { Button, Form, Table, Input, Select, DatePicker } from 'antd';
import './index.less';

const Option = Select.Option;

class A extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // add code here...
            }
        });
    }
    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div className="page-container">
                
                    
                    
                
                    
                    
                
            </div>
        );
    }
}

export default A;