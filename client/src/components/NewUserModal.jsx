import React, {useState} from 'react';
import {Alert, Input, Modal, Space} from "antd";
import {closeNewUserModal} from "../actions/newUserModalActions";
import {connect} from "react-redux";
import {LockOutlined, UserOutlined} from "@ant-design/icons";

const NewUserModal = props => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [ShowAlert, setShowAlert] = useState(false);
    const [newUser, setNewUser] = useState({email: "", newPass: "", newPassRepeat: ""});
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;

    const isEmailValid = () => {
        if (!emailRegex.test(newUser.email)) {
            return false
        }
        return true
    }

    const isNewUserValid = () => {
        if (newUser.email === "" || newUser.newPass === "" || newUser.newPassRepeat === "") {
            return false
        }
        if (!isEmailValid()) {
            return false
        }
        if (newUser.newPass !== newUser.newPassRepeat) {
            return false
        }
        return true
    }

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            if (isNewUserValid()) {
                props.close();
                setConfirmLoading(false);
                setShowAlert(false)
            } else {
                setShowAlert(true)
                console.log("Not Valid User!")
                setConfirmLoading(false);
            }
        }, 2000)
    };

    const handleCancel = () => {
        setShowAlert(false)
        props.close();
    };
    return (
        <>
            <Modal
                centered
                title="New user"
                visible={props.newUserModal.isOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={confirmLoading}
            >
                <div style={{display: "flex", alignSelf: "center", flexDirection: "column", width: '100%'}}>
                    <Space size={"large"} direction={"vertical"}>
                        <Input size="large" placeholder="Enter your email" prefix={<UserOutlined/>}
                               onChange={e => setNewUser({...newUser, email: e.target.value})}/>
                        <Input.Password size="large" placeholder="Enter new password" prefix={<LockOutlined/>}
                                        onChange={e => setNewUser({...newUser, newPass: e.target.value})}/>
                        <Input.Password size="large" placeholder="Enter new password again" prefix={<LockOutlined/>}
                                        onChange={e => setNewUser({...newUser, newPassRepeat: e.target.value})}/>
                        {ShowAlert ? <Alert message="Be sure you've entered valid information" type="error"/> : null}
                    </Space>
                </div>
            </Modal>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        newUserModal: state.newUserModalReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        close: () => {
            dispatch(closeNewUserModal())
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewUserModal);
