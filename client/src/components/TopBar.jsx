import React, {} from "react";
import {Typography} from 'antd';
import {connect} from "react-redux";

const {Title} = Typography;


const TopBar = (props) => {

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            height: 100,
            backgroundColor: "#096dd9"
        }}>
            <Title level={2} style={{color: "#ffffff"}}>Welcome to your Dashboard {props.userR.name}!</Title>
        </div>
    );

}

const mapStateToProps = (state) => {
    return {
        userR: state.userReducer,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
