import React, { Component } from 'react';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { Layout, LocaleProvider } from 'antd';
import EditPageNameModal from './component/Modal/EditPageNameModal';
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
            pageName: '', // 页面名称
        };
        this.onCloseModal = this.onCloseModal.bind(this);
    }
    onCloseModal({ pageName }) {
        this.setState({
            showEditNameModal: false,
            pageName,
        });
    }
    render() {
        const { showEditNameModal, pageName } = this.state;
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
                                />
                            </Content>
                        </Layout>
                        < EditPageNameModal
                            onCloseModal={this.onCloseModal}
                            showModal={showEditNameModal}
                        />
                    </Layout>
                </LocaleProvider>
            </div>
        );
    }
}

export default App;
