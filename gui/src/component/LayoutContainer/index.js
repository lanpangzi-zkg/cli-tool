import React, { PureComponent, Fragment } from 'react';
import { FORM_CONTAINER, TABLE_CONTAINER, EMPTY_CONTAINER, BOX_CONTINAER } from '../common/Constants';
import FormContainer from './FormContainer';
import TableContainer from './TableContainer';
import BoxContainer from './BoxContainer';
import EmptyContainer from './EmptyContainer';
import './index.css';

class LayoutContainer extends PureComponent {
    renderContainer() {
        const { layoutConfig, ...restProps } = this.props;
        if (Array.isArray(layoutConfig) && layoutConfig.length > 0) {
            return layoutConfig.map((config) => {
                const { type, layoutIndex } = config;
                const k = `layout-${layoutIndex}`;
                const transferProps = Object.assign({ key: k }, restProps, config);
                if (type === FORM_CONTAINER) {
                    return (<FormContainer {...transferProps} />);
                } else if (type === TABLE_CONTAINER) {
                    return (<TableContainer {...transferProps} />);
                } else if (type === EMPTY_CONTAINER) {
                    return (<EmptyContainer {...transferProps} />);
                } else if (type === BOX_CONTINAER) {
                    return (<BoxContainer {...transferProps} />);
                }
                return null;
            });
        }
        return (
            <div className="empty-tips">请添加容器组件</div>
        );
    }
    render() {
        return (
            <Fragment>
                {
                    this.renderContainer()
                }
            </Fragment>
        );
    }
}

export default LayoutContainer;