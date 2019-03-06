import React, { Component } from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { Layout, LocaleProvider } from 'antd';
import EditPageName from './component/Modal/EditPageName';
import PreviewPageModal from './component/Modal/PreviewPageModal';
import DragTabs from './component/DragTabs';
import MainContainer from './component/MainContainer';
import "antd/dist/antd.css";
import './App.css';

const { Sider, Content } = Layout;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditNameModal: true, // 显示编辑页面名称弹窗
            showPreviewModal: false, // 显示预览窗口
            pageName: '', // 页面名称
        };
        this.onCloseModal = this.onCloseModal.bind(this);
        this.onPreviewPage = this.onPreviewPage.bind(this);
        this.onClosePreviewModal = this.onClosePreviewModal.bind(this);
    }
    onCloseModal({ pageName }) {
        this.setState({
            showEditNameModal: false,
            pageName,
        });
    }
    onClosePreviewModal() {
        this.setState({
            showPreviewModal: false,
        });
    }
    onPreviewPage(layoutConfig) {
        this.setState({
            showPreviewModal: true,
        });
        this.layoutConfig = layoutConfig;
	}
    render() {
        const { showEditNameModal, showPreviewModal, pageName } = this.state;
        return (
            <div className="App">
                <LocaleProvider locale={zhCN}>
                    <Layout>
                        <Sider width="300">
                            <DragTabs />
                        </Sider>
                        <Layout>
                            <Content>
                                <MainContainer
                                    pageName={pageName}
                                    onPreviewPage={this.onPreviewPage}
                                />
                            </Content>
                        </Layout>
                        < EditPageName
                            onCloseModal={this.onCloseModal}
                            showModal={showEditNameModal}
                        />
                        <PreviewPageModal
                            layoutConfig={this.layoutConfig}
                            onCloseModal={this.onClosePreviewModal}
                            showModal={showPreviewModal}
                        />
                    </Layout>
                </LocaleProvider>
            </div>
        );
    }
}

export default App;
