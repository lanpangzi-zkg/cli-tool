import { Form } from 'antd';
import BaseView from '../Base/BaseView';
import layoutConfig from './layoutConfig';

class Test extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            total: 10,
        };
    }
    getLayoutConfig() {
        return layoutConfig;
    }
    getTableTotal() {
        return this.state.total;
    }
    getTableData() {
        return [{ dataIndex0: '1' }, { dataIndex0: '2' }, { dataIndex0: '3' }];
    }
    onSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
              console.log('Received values of form: ', values);
            }
        });
    }
}

export default Form.create()(Test);