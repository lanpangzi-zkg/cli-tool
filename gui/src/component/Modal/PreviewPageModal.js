/**
 * @desc 页面预览窗口
 */
import React, { Component } from 'react';
import ViewGenerater from '../Generater/ViewGenerater';
import { Form, Modal } from 'antd';

@Form.create()
class Preview extends ViewGenerater {
    getLayoutConfig() {
        const { layoutConfig } = this.props;
        return layoutConfig;
    }
}

class PreviewPageModal extends Component {
    render() {
        const { showModal, layoutConfig, onCloseModal } = this.props;
        return (
            <Modal
                visible={showModal}
                footer={null}
                width={'100%'}
                closable
                centered
                onCancel={onCloseModal}
                title="页面预览"
                maskClosable
            >
                <Preview layoutConfig={layoutConfig} />  
            </Modal>
        );
    }
}

export default PreviewPageModal;