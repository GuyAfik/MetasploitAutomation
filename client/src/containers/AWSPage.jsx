import React from "react";
import {Divider, Empty, Typography} from 'antd';
const {Title} = Typography;
const AWSPage = () => {

    return (
        <div style={{width: '100%'}}>
            <div style={{display: "flex"}}>
                <Title level={4} style={{color: "#91d5ff", marginLeft: 20}}>AWS</Title>
            </div>
            <Divider/>
            <div style={{height: '80vh', width: '100%', display: "flex", justifyContent: "center"}}>
                <Empty style={{alignSelf: "center"}}/>
            </div>
        </div>);

}
export default AWSPage;
