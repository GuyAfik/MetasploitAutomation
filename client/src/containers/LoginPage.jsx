import React, {useState} from 'react';
import {Alert, Button, Input, Space, Spin} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {useHistory} from "react-router-dom";
import {openNewUserModal} from "../actions/newUserModalActions";
import NewUserModal from "../components/NewUserModal";
import {connect} from "react-redux";

const LoginPage = props => {
    const history = useHistory();
    const [showAlert, setShowAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const performLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            if (userEmail === "" || userPassword === "") {
                setShowAlert(true);
                setIsLoading(false);
            } else {
                console.log(userEmail, userPassword)
                history.push('/home');
            }
        }, 1500);
    }


    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            height: '100vh',
            width: '100%',
            flexDirection: "column"
        }}>
            <div style={{display: "flex", alignSelf: "center", flexDirection: "column", width: '350px'}}>
                <Space size={"large"} direction={"vertical"}>
                    <Input size="large" placeholder="Enter email" prefix={<UserOutlined/>}
                           onChange={e => setUserEmail(e.target.value)}/>
                    <Input.Password size="large" placeholder="Enter password" prefix={<LockOutlined/>}
                                    onChange={e => setUserPassword(e.target.value)}/>
                </Space>
            </div>
            <NewUserModal/>
            <div style={{display: "flex", marginTop: '25px', marginBottom: '25px', justifyContent: "center"}}>
                {isLoading ? <Spin size={"large"} tip="Loading..."/> :
                    <div>
                        <Button type={"primary"} shape={"round"} onClick={() => {
                            performLogin();
                        }}>
                            Login
                        </Button>
                        <Button type="link" onClick={() => props.open()}>Not a User? register</Button>
                    </div>
                }
            </div>
            {showAlert ? <Alert
                style={{width: '400px', alignSelf: "center"}}
                message="Error"
                description="Email or password are wrong. Please try again"
                type="error"
                showIcon
            /> : null}
        </div>);
};

const mapStateToProps = (state) => {
    return {
        newUserModal: state.newUserModalReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        open: () => {
            dispatch(openNewUserModal())
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
