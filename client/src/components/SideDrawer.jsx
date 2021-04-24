import React, {useEffect, useState} from 'react';
import {Drawer, Form, Button, Col, Row, Input, Select, Result} from 'antd';
import {connect} from 'react-redux';
import {closeSideDrawer} from "../actions/sideDrawerActions";
import {addCard, updateCard} from "../actions/userActions";
import {updateUser} from "../Utils/Utils";
import ApiRequestsHandler from "../handler/ApiRequestsHandler";

const {Option} = Select;

/**
 * DONT pay attention! just for boilerplate!
 * @returns {JSX.Element}
 * @constructor
 */
const PortsScanningFields = () => {
    return (<Row gutter={16}>
        <Col span={12}>
            <Form.Item
                name="name"
                label="Name"
                rules={[{required: true, message: 'Name can\'t be empty!',}]}
            >
                <Input placeholder="Give your pentest a name"/>
            </Form.Item>
        </Col>
        <Col span={12}>
            <Form.Item
                name="ipAddress"
                label="Target IP address"
                rules={[{required: true, message: 'IP Address can\'t be empty!'}]}
            >
                <Input placeholder="Please enter ip address"/>
            </Form.Item>
        </Col>
    </Row>);
}

const SqlInjectionFields = () => {
    return (null);
}

const DdosFields = () => {
    return (null);
}

const renderSwitch = (exploit) => {
    switch (exploit) {
        case "ports scanning":
            return PortsScanningFields();
        case "Ddos":
            return DdosFields();
        case "sql injection":
            return SqlInjectionFields();
        default:
            return null;

    }
}

const SideDrawer = (props) => {
    const [newCard, setNewCard] = useState({
        id: "",
        name: "",
        ip: "",
        exploit: "",
        description: "",
        status: "starting..."
    });
    const [createFailed, setCreateFailed] = useState(false);
    const [updateFailed, setUpdateFailed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    /**
     * Saves and creates new card only after the uid is set as state.
     */
    useEffect(() => {
        if (newCard.id !== "") {
            let handler = new ApiRequestsHandler(props.updateCard, newCard);
            handler.startTest();
            let user = props.userR;
            user = {...user, data: {cards: [...user.data.cards, newCard]}};
            updateUser(user.email, user).then(res => {
                if (res.ok) {
                    setLoading(false);
                    props.addCard(newCard);
                    handleOnClose();
                } else {
                    setLoading(false);
                    setUpdateFailed(true);
                }
            })
        }
    }, [newCard.id])

    const handleOnClose = () => {
        props.close();
        setUpdateFailed(false)
        setCreateFailed(false);
        setNewCard({id: "", name: "", ip: "", exploit: "", description: "", status: "starting..."});
        form.resetFields();
    }

    const handleOnSubmit = () => {
        setUpdateFailed(false)
        setCreateFailed(false);
        setLoading(true);
        if (newCard.name !== "" && newCard.ip !== "" && newCard.exploit !== "") {
            setNewCard({...newCard, id: Date.now()});
        } else {
            setLoading(false);
            setCreateFailed(true);
        }
    }


    return (
        <>
            <Drawer
                title="Create new pentest "
                width={720}
                onClose={handleOnClose}
                visible={props.sideDrawerR.isOpen}
                bodyStyle={{paddingBottom: 80}}
            >
                <Form layout="vertical" hideRequiredMark form={form}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[{required: true, message: 'Name can\'t be empty!',}]}
                            >
                                <Input onChange={e => setNewCard({...newCard, name: e.target.value})}
                                       placeholder="Give your pentest a name"/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="ipAddress"
                                label="Target IP address"
                                rules={[{required: true, message: 'IP Address can\'t be empty!'}]}
                            >
                                <Input onChange={e => setNewCard({...newCard, ip: e.target.value})}
                                       placeholder="Please enter ip address"/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="exploit"
                                label="Exploit"
                                rules={[{required: true, message: 'Exploit can\'t be empty!'}]}
                            >
                                <Select onChange={value => setNewCard({...newCard, exploit: value})}
                                        placeholder="Please select an exploit">
                                    <Option value="Ddos">Ddos</Option>
                                    <Option value="sql injection">SQL Injection</Option>
                                    <Option value="ports scanning">Ports scanning</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    {renderSwitch(newCard.exploit)}
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[
                                    {
                                        required: false,
                                        message: 'please enter url description',
                                    },
                                ]}
                            >
                                <Input.TextArea onChange={e => setNewCard({...newCard, description: e.target.value})}
                                                rows={4}
                                                placeholder="please enter short description"/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <div style={{display: "flex", flexDirection: "column", width: '100%', height: '40vh'}}>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            {createFailed ? <Result
                                status="error"
                                title="Oppss..."
                                subTitle="Please check the required fileds are filled before resubmitting."
                            /> : null}
                            {updateFailed ? <Result
                                status="500"
                                title="Something went wrong"
                                subTitle="The operation on the server side could not be completed. Please try again later."
                            /> : null}
                        </div>
                        <Form.Item>
                            <div style={{position: "fixed", bottom: '20px', right: '20px'}}>
                                <Button type="primary" htmlType="submit" loading={loading} onClick={handleOnSubmit}
                                        style={{marginRight: 8}}>
                                    Create
                                </Button>
                                <Button onClick={handleOnClose}>
                                    Cancel
                                </Button>
                            </div>
                        </Form.Item>
                    </div>
                </Form>
            </Drawer>
        </>
    )
        ;
};

const mapStateToProps = (state) => {
    return {
        sideDrawerR: state.sideDrawerReducer,
        userR: state.userReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        close: () => {
            dispatch(closeSideDrawer())
        },
        addCard: (card) => {
            dispatch(addCard(card))
        },
        updateCard: (card) => {
            dispatch(updateCard(card))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SideDrawer);
