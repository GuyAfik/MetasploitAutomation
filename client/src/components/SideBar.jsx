import React, {} from "react";
import {Divider, Menu} from 'antd';
import {AmazonOutlined, DropboxOutlined, HomeOutlined, MoreOutlined} from '@ant-design/icons';
import {BrowserRouter as Router, Link} from "react-router-dom";

const SideBar = () => {

    const handleClick = e => {
        console.log('click ', e);
    };

    return (
        <Router>
            <Menu
                onClick={handleClick}
                style={{width: '100%'}}
                defaultSelectedKeys={['1']}
                mode="inline"
            >

                <Menu.ItemGroup key="g1" title="General">
                    <Divider/>
                    <Menu.Item key="1" icon={<HomeOutlined/>}><Link to={'/'}>Home</Link></Menu.Item>
                    <Menu.Item key="2" icon={<AmazonOutlined/>}><Link to={'/statistics'}>AWS</Link></Menu.Item>
                    <Menu.Item key="3" icon={<DropboxOutlined/>}>Docker</Menu.Item>
                    <Menu.Item key="4" icon={<MoreOutlined/>}>More</Menu.Item>
                </Menu.ItemGroup>


            </Menu>
        </Router>
    );

}
export default SideBar;
