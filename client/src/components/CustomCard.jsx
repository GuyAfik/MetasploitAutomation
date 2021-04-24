import React from "react";
import {Card, Grid, Icon} from 'semantic-ui-react';
import Text from "antd/lib/typography/Text";
import {LoadingOutlined, CheckOutlined} from '@ant-design/icons';
import {Tooltip} from 'antd';
import {openCardModal} from "../actions/modalsActions";
import {connect} from "react-redux";


const CustomCard = (props) => {
// details: {name:"", ip:"", exploit:"", description:"", status:""}
    const {details} = props;


    return (
        <Tooltip title={details.description}>
            <Card raised={true} style={{width: 190}} onClick={() => props.openCardModal(details)}>
                <Card.Content>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                        < Icon style={{alignSelf: 'center'}} size={"huge"} name='laptop'/>
                        <Text style={{alignSelf: 'center'}}>{details.name}</Text>
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
                            {details.status !== "finished" ?
                                <LoadingOutlined style={{marginLeft: 10, marginRight: 10, fontSize: 20}}/> :
                                <CheckOutlined style={{marginLeft: 10, marginRight: 10, fontSize: 20}}/>
                            }
                            {details.status}
                        </Grid.Row>
                    </Grid>
                </Card.Content>
            </Card>
        </Tooltip>);

}

const mapStateToProps = (state) => {
    return {};
}

const mapDispatchToProps = (dispatch) => {
    return {
        openCardModal: (card) => {
            dispatch(openCardModal(card))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomCard);
