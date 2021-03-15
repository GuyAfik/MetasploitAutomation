import React, {useState} from 'react';
import {Drawer, Form, Button, Col, Row, Input, Select, Result} from 'antd';
import {connect} from 'react-redux';
import {closeSideDrawer} from "../actions/sideDrawerActions";
import {addCard} from "../actions/cardsActions";

const {Option} = Select;

const SideDrawer = (props) => {
    const [newCard, setNewCard] = useState({name: "", ip: "", exploit: "", description: ""});
    const [createFailed, setCreateFailed] = useState(false);
    const [form] = Form.useForm();

    const handleOnClose = () => {
        props.close();
        setCreateFailed(false);
        setNewCard({name: "", ip: "", exploit: "", description: ""});
        form.resetFields();
    }

    const handleOnSubmit = () => {
        if (newCard.name !== "" && newCard.ip !== "" && newCard.exploit !== "") {
            props.addCard(newCard)
            console.log(newCard);
            handleOnClose();
        } else {
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
                                    <Option value="ip spoofing">IP Spoofing</Option>
                                    <Option value="man in the middle">Man in the middle</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
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
                        </div>
                        <Form.Item>
                            <div style={{position: "fixed", bottom: '20px', right: '20px'}}>
                                <Button type="primary" htmlType="submit" onClick={handleOnSubmit}
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
        sideDrawerR: state.sideDrawerReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        close: () => {
            dispatch(closeSideDrawer())
        },
        addCard: (card) => {
            dispatch(addCard(card))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SideDrawer);
