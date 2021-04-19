import React, {useState} from 'react';
import {Alert, Input, Modal, Space} from "antd";
import {closeNewUserModal} from "../actions/modalsActions";
import {connect} from "react-redux";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {createUser, isEmailValid} from "../Utils/Utils";

const NewUserModal = props => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [alert, setAlert] = useState({isShown: false, description: ""});
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        newPass: "",
        newPassRepeat: ""
    });

    const isNewUserValid = () => {
        if (newUser.email === "" || newUser.newPass === "" || newUser.newPassRepeat === "" || newUser.name === "") {
            setConfirmLoading(false);
            setAlert({isShown: true, description: 'One of the fields are empty!'});
            return false
        }
        if (newUser.newPass !== newUser.newPassRepeat) {
            setConfirmLoading(false);
            setAlert({isShown: true, description: 'Passwords are not identical!'});
            return false
        }
        return true
    }

    const handleOk = () => {
        setConfirmLoading(true);
        if (isNewUserValid()) {
            createUser(newUser).then(res => {
                if (res.ok) {
                    res.json().then(data => {
                        console.log(data)
                        props.close();
                        setAlert({...alert, isShown: false})
                        setConfirmLoading(false);
                    })
                } else {
                    res.json().then(err => {
                        setConfirmLoading(false);
                        setAlert({isShown: true, description: err.Error.Message})
                    })
                }
            })
        }
    }

    const handleCancel = () => {
        setAlert({...alert, isShown: false})
        props.close();
    };
    return (
        <>
            <Modal
                centered
                title="New user"
                visible={props.modalsR.newUserModal.isOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={confirmLoading}
            >
                <div style={{display: "flex", alignSelf: "center", flexDirection: "column", width: '100%'}}>
                    <Space size={"large"} direction={"vertical"}>
                        <Input size="large" placeholder="Enter your name" prefix={<UserOutlined/>}
                               onChange={e => setNewUser({...newUser, name: e.target.value})}/>
                        <Input size="large" placeholder="Enter your email" prefix={<UserOutlined/>}
                               onChange={e => setNewUser({...newUser, email: e.target.value})}/>
                        <Input.Password size="large" placeholder="Enter new password" prefix={<LockOutlined/>}
                                        onChange={e => setNewUser({...newUser, newPass: e.target.value})}/>
                        <Input.Password size="large" placeholder="Enter new password again" prefix={<LockOutlined/>}
                                        onChange={e => setNewUser({...newUser, newPassRepeat: e.target.value})}/>
                        {alert.isShown ? <Alert message={alert.description} type="error"/> : null}
                    </Space>
                </div>
            </Modal>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        modalsR: state.modalsReducer
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
