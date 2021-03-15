import React, {} from "react";
import { Typography } from 'antd';
const { Title } = Typography;


const TopBar = (props) => {
    const {user} = props;


    return (
            <div style={{display: "flex", alignItems: "center", justifyContent:"space-around", height: 100, backgroundColor: "#096dd9"}}>
                    <Title level={2} style={{color: "#ffffff"}}>Welcome to your Dashboard</Title>
            </div>
    );

}

export default TopBar;
