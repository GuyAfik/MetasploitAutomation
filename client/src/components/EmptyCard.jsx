import React from "react";
import {Card} from 'semantic-ui-react'
import {Empty} from 'antd';


const EmptyCard = (props) => {
    const {Click} = props;
    return (<Card raised={true} onClick={Click}>
        <div style={{display: "flex", justifyContent: "center", height: 300}}>
            <Empty style={{alignSelf: "center"}}/>
        </div>
    </Card>);

}

export default EmptyCard;
