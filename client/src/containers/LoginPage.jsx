import React, {useState} from 'react';
import {Alert, Button, Input, Space, Spin} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {useHistory} from "react-router-dom";
import {openNewUserModal} from "../actions/modalsActions";
import NewUserModal from "../components/NewUserModal";
import {connect} from "react-redux";
import {newSession, saveEmail} from "../actions/userActions";
import {getUser, isEmailValid} from '../Utils/Utils';

const LoginPage = props => {

    const history = useHistory();
    const [alert, setAlert] = useState({isShown: false, description: ""});
    const [isLoading, setIsLoading] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    /**
     * fires after "Login" button. fetch user from the server by the provided email and password
     */
    const performLogin = () => {
        setIsLoading(true);
        if (userEmail === "" || userPassword === "") {
            setAlert({isShown: true, description: "Email or Password are empty!"});
            setIsLoading(false);
        } else if (!isEmailValid(userEmail)) {
            setAlert({isShown: true, description: "Email is invalid! it should be in the form: xxx@xxx.xxx"});
            setIsLoading(false);
        } else if (userPassword.length < 8) {
            setAlert({isShown: true, description: "Password length should be at least 8 characters!"});
            setIsLoading(false);
        } else {
            getUser(userEmail, userPassword).then(res => {
                if (res.ok) {
                    res.json().then(user => {
                        props.startNewSession(user);
                        props.saveEmail(userEmail);
                        history.push('/home');
                    })
                } else {
                    res.json().then(err => {
                        console.log(`Error: ${JSON.stringify(err)}`)
                        setAlert({
                            isShown: true,
                            description: `${err.Error.Message}`
                        });
                        setIsLoading(false);
                    })
                }
            })
        }
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
            {alert.isShown ? <Alert
                style={{width: '400px', alignSelf: "center"}}
                message="Error"
                description={alert.description}
                type="error"
                showIcon
            /> : null}
        </div>);
};

const mapStateToProps = (state) => {
    return {
        userR: state.userReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        open: () => {
            dispatch(openNewUserModal())
        },
        startNewSession: (user) => {
            dispatch(newSession(user))
        },
        saveEmail: (email) => {
            dispatch(saveEmail(email))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
