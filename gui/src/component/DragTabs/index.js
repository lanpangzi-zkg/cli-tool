import React, { Component } from 'react';
import { Tabs } from 'antd';
import TargetFactory from '../DragTarget/TargetFactory';

const TabPane = Tabs.TabPane;

class DragTabs extends Component {
	componentDidMount() {
        /* 放置目标元素时触发事件 */
         document.addEventListener("dragover", function( event ) {
             // 阻止默认动作以启用drop
             event.preventDefault();
         }, false);

        /* 拖动目标元素时触发drag事件 */
         document.addEventListener("drag", function( event ) {

        }, false);

        document.addEventListener("dragstart", function( event ) {
          // 使其半透明
              event.target.style.opacity = .5;
        }, false);

        document.addEventListener("dragend", function( event ) {
            // 重置透明度
            event.target.style.opacity = "";
            document.querySelectorAll('.drop-zone').forEach((t) => {
              	t.style.background = "#fff";
            })
        }, false);

        document.addEventListener("dragenter", function( event ) {
          // 当可拖动的元素进入可放置的目标时高亮目标节点
          if ( event.target.className === "drop-zone" ) {
              event.target.style.background = "#96cdf9";
          }
        }, false);

        document.addEventListener("dragleave", function( event ) {
          // 当拖动元素离开可放置目标节点，重置其背景
          if ( event.target.className === "drop-zone" ) {
              event.target.style.background = "";
          }
        }, false);
    }
	render() {
		return (
			<Tabs defaultActiveKey="1">
			    <TabPane tab="布局" key="layout">
                    <TargetFactory tabType="layout" />
			    </TabPane>
			    <TabPane tab="表单" key="form">
                    <TargetFactory />
			    </TabPane>
			    <TabPane tab="模板" key="template">
                    <TargetFactory tabType="template" />
			    </TabPane>
		  	</Tabs>
		);
	}
}

export default DragTabs;
