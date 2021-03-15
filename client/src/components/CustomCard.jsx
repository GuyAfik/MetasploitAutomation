import React from "react";
import {Card, Grid, Icon} from 'semantic-ui-react';
import Text from "antd/lib/typography/Text";
import {LoadingOutlined} from '@ant-design/icons';
import {Tooltip} from 'antd';


const CustomCard = (props) => {
// details: {name:"", ip:"", exploit:"", description:""}
    const {details} = props;

    return (
        <Tooltip title={details.description}>
        <Card raised={true} style={{width: 190}} onClick={() =>console.log(details.description)}>
            <Card.Content>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                    < Icon style={{alignSelf:'center'}} size={"huge"} name='laptop'/>
                    <Text style={{alignSelf:'center'}}>{details.name}</Text>
                </div>
            </Card.Content>
            <Card.Content extra>
                <Grid columns={1} style={{
                    width: '100%'
                }}>
                    <Grid.Row>
                        < Icon style={{marginLeft: 10}} size={"large"} name='computer'/>
                        {details.ip}
                    </Grid.Row>
                    <Grid.Row>
                        < Icon style={{marginLeft: 10}} size={"large"} name='user secret'/>
                        {details.exploit}
                    </Grid.Row>
                    <Grid.Row>
                        <LoadingOutlined style={{marginLeft: 10, marginRight:10, fontSize: 20}}/>
                        working...
                    </Grid.Row>
                </Grid>
            </Card.Content>
        </Card>
        </Tooltip>);

}

export default CustomCard;