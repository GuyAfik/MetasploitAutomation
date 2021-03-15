import React from 'react';
import {Row, Col, Menu, Divider} from 'antd';
import 'antd/dist/antd.css';
import TopBar from "./components/TopBar";
import HomePage from "./containers/HomePage";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import AWSPage from "./containers/AWSPage";
import {AmazonOutlined, DropboxOutlined, HomeOutlined, MoreOutlined} from "@ant-design/icons";
import DockerPage from "./containers/DockerPage";
import LoginPage from "./containers/LoginPage";


export function App() {
    return (
        <Router>
            <Switch>
                <Route path="/login">
                    <LoginPage/>
                </Route>
                <div>
                    <Row>
                        <Col span={24}>
                            <TopBar/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <Menu
                                style={{width: '100%'}}
                                defaultSelectedKeys={['1']}
                                mode="inline"
                            >
                                <Menu.ItemGroup key="g1" title="General">
                                    <Divider/>
                                    <Menu.Item key="1" icon={<HomeOutlined/>}><Link to={'/home'}>Home</Link></Menu.Item>
                                    <Menu.Item key="2" icon={<AmazonOutlined/>}><Link
                                        to={'/aws'}>AWS</Link></Menu.Item>
                                    <Menu.Item key="3" icon={<DropboxOutlined/>}><Link
                                        to={'/metasploit'}>Metasploit Details</Link></Menu.Item>
                                    <Menu.Item key="4" icon={<MoreOutlined/>}>More</Menu.Item>
                                </Menu.ItemGroup>
                            </Menu>

                        </Col>
                        <Col span={18}>
                            <Row>
                                <Route path="/home">
                                    <HomePage/>
                                </Route>
                                <Route path="/aws">
                                    <AWSPage/>
                                </Route>
                                <Route path="/metasploit">
                                    <DockerPage/>
                                </Route>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Switch>
        </Router>

    )
        ;
}

export default App;
