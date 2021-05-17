import React, {useEffect, useState} from 'react';
import {Drawer, Form, Button, Col, Row, Input, Select, Result} from 'antd';
import {connect} from 'react-redux';
import {closeSideDrawer} from "../actions/sideDrawerActions";
import {addCard, updateCard} from "../actions/userActions";
import {getCurrentTime, updateUser} from "../Utils/Utils";
import ApiRequestsHandler from "../handler/ApiRequestsHandler";
import {addEC2, removeEC2} from "../actions/awsActions";
import {EXPLOITS, PAYLOADS} from "../Utils/Constants";

const {Option} = Select;

const DdosFields = () => {
    return (null);
}
/**
 * ftp attack component in the side drawer. rendered only if the user chose FTP Attack from the scan type drop down.
 * @param exploit - name of the exploit
 * @param payload - name of the payload
 * @param setExploitForPenTest - set state method for the exploit
 * @param setPayloadForPenTest - set state method for the payload
 * @returns {JSX.Element}
 * @constructor
 */
const FTPAttackFields = (exploit, payload, setExploitForPenTest, setPayloadForPenTest) => {

    const handleExploitChanged = (exploit) => {
        setExploitForPenTest(exploit)
    }

    const handlePayloadChanged = (payload) => {
        setPayloadForPenTest(payload)
    }

    return (<Row gutter={16}>
        <Col span={12}>
            <Form.Item
                name="exploit"
                label="Exploit"
                rules={[{required: true, message: 'Exploit can\'t be empty!',}]}
            >
                <Select onChange={exploit => handleExploitChanged(exploit)} defaultValue={EXPLOITS[0]}>
                    {EXPLOITS.map(exploit => {
                        return <Option value={exploit}>{exploit}</Option>
                    })}
                </Select>
            </Form.Item>
        </Col>
        <Col span={12}>
            <Form.Item
                name="payload"
                label="Payload"
                rules={[{required: true, message: 'Payload can\'t be empty!',}]}
            >
                <Select onChange={payload => handlePayloadChanged(payload)} value={payload}>
                    {exploit.map(payload => {
                        return <Option value={payload}>{payload}</Option>
                    })}
                </Select>
            </Form.Item>
        </Col>
    </Row>);
}
/**
 * renders scan type component according to the user choise
 * @param scanType
 * @param exploit
 * @param payload
 * @param setExploitForPenTest
 * @param setPayloadForPenTest
 * @returns {JSX.Element|null|*}
 */
const renderSwitch = (scanType, exploit, payload, setExploitForPenTest, setPayloadForPenTest) => {
    switch (scanType) {
        case "ports scanning":
            return null;
        case "Ddos":
            return DdosFields();
        case "ftp attack":
            return FTPAttackFields(exploit, payload, setExploitForPenTest, setPayloadForPenTest);
        default:
            return null;

    }
}

/**
 * side drawer component
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const SideDrawer = (props) => {
    const [createFailed, setCreateFailed] = useState(false);
    const [exploit, setExploit] = useState(PAYLOADS[EXPLOITS[0]]);
    const [payload, setPayload] = useState(PAYLOADS[EXPLOITS[0]][0]);
    const [updateFailed, setUpdateFailed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newCard, setNewCard] = useState({
        startTime: "",
        endTime: "",
        id: "",
        name: "",
        ip: "",
        scanType: "",
        description: "",
        status: {state: "", description: ""},
        exploit: exploit,
        payload: payload
    });
    const [form] = Form.useForm();

    /**
     * Saves and creates new card only after the uid is set as state.
     */
    useEffect(() => {
        if (newCard.id !== "") {
            let user = props.userR;
            user = {...user, data: {cards: [...user.data.cards, newCard]}};
            updateUser(user.email, user).then(res => {
                if (res.ok) {
                    props.addCard(newCard);
                    setLoading(false);
                    let handler = new ApiRequestsHandler(props.updateCard, newCard, props.addEc2, props.removeEc2);
                    handler.startTest();
                    handleOnClose();
                } else {
                    setLoading(false);
                    setUpdateFailed(true);
                }
            })
        }
    }, [newCard.id])

    /**
     * triggers when the user close the side drawer. reset the pentest details
     */
    const handleOnClose = () => {
        props.close();
        setUpdateFailed(false)
        setCreateFailed(false);
        setNewCard({
            id: "",
            name: "",
            ip: "",
            scanType: "",
            description: "",
            status: {state: "", description: ""},
            exploit: exploit,
            payload: payload
        });
        form.resetFields();
    }

    /**
     * triggers after the user clicks "create". saves the new pentest details in state
     */
    const handleOnSubmit = () => {
        setUpdateFailed(false)
        setCreateFailed(false);
        setLoading(true);
        if (newCard.name !== "" && newCard.ip !== "" && newCard.scanType !== "") {
            setNewCard({...newCard, id: Date.now(), startTime: getCurrentTime()});
        } else {
            setLoading(false);
            setCreateFailed(true);
        }
    }

    const setExploitForPenTest = (exploit) => {
        setExploit(PAYLOADS[exploit]);
        setPayload(PAYLOADS[exploit][0])
        setNewCard({...newCard, exploit: exploit});
    }

    const setPayloadForPenTest = (payload) => {
        setPayload(payload)
        setNewCard({...newCard, payload: payload});
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
                                name="scanType"
                                label="Scan type"
                                rules={[{required: true, message: 'Scan type can\'t be empty!'}]}
                            >
                                <Select onChange={value => setNewCard({...newCard, scanType: value})}
                                        placeholder="Please select a scan type">
                                    <Option value="Ddos">Ddos</Option>
                                    <Option value="ftp attack">FTP Attack</Option>
                                    <Option value="ports scanning">Ports scanning</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    {renderSwitch(newCard.scanType, exploit, payload, setExploitForPenTest, setPayloadForPenTest)}
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
        userR: state.userReducer,
        awsR: state.awsReducer
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
        },
        addEc2: (ec2) => {
            dispatch(addEC2(ec2))
        },
        removeEc2: (ec2) => {
            dispatch(removeEC2(ec2));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SideDrawer);
