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
        // if (isNewUserValid()) {
            createUser(newUser).then(res => {
                console.log(res)
                props.close();
                setAlert({...alert, isShown: false})
                setConfirmLoading(false);
            }).catch(err => {
                console.log(err)
                setConfirmLoading(false);
                setAlert({isShown: true, description: err})
            });
        // } else {
        //     setConfirmLoading(false);
        //     setAlert({isShown: true, description: 'User is not Valid!'})
        // }
    };

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
                               onChange={e => setNewUser({...newUser, lastName: e.target.value})}/>
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
