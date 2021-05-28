import React from "react";
import {Card, Grid, Icon} from 'semantic-ui-react';
import Text from "antd/lib/typography/Text";
import {LoadingOutlined, CheckOutlined, CloseOutlined} from '@ant-design/icons';
import {Tooltip} from 'antd';
import {openCardModal} from "../actions/modalsActions";
import {connect} from "react-redux";


/**
 * Card for presenting pentest to the user.
 * @param props - new pentest details
 * @returns {JSX.Element}
 * @constructor
 */
const CustomCard = (props) => {
// details: {name:"", ip:"", scanType:"", description:"", status: {state: "", description: ""}, startTime: "", endTime: ""}
    const {details} = props;

    /**
     * renders the scan description according to the status in different colors (Finished, Failed od Running)
     * @returns {JSX.Element}
     */
    const getStatusElement = () => {
        if (details.status.state == "Finished") {
            return (
                <div style={{display: 'flex', flexDirection: 'row', marginLeft: -12, marginTop: 10, marginBottom: 10}}>
                    <CheckOutlined style={{marginLeft: 10, marginRight: 10, fontSize: 20}}/>
                    <Text type="success" style={{width: 140, marginLeft: -3}}
                          ellipsis={{tooltip: `${details.status.description}`}}>{details.status.description}</Text>
                </div>)
        } else if (details.status.state == "Failed") {
            return (
                <div style={{display: 'flex', flexDirection: 'row', marginLeft: -12, marginTop: 10, marginBottom: 10}}>
                    <CloseOutlined style={{marginLeft: 10, marginRight: 10, fontSize: 20}}/>
                    <Text type="danger" style={{width: 140, marginLeft: -3}}
                          ellipsis={{tooltip: `${details.status.description}`}}>{details.status.description}</Text>
                </div>)
        } else {
            return (
                <div style={{display: 'flex', flexDirection: 'row', marginLeft: -12, marginTop: 10, marginBottom: 10}}>
                    <LoadingOutlined style={{marginLeft: 10, marginRight: 10, fontSize: 20}}/>
                    <Text type="secondary" style={{width: 140, marginLeft: -3}}
                          ellipsis={{tooltip: `${details.status.description}`}}>{details.status.description}</Text>
                </div>)
        }
    }


    return (
        <Tooltip title={details.description}>
            <Card raised={true} style={{width: 190}} onClick={() => {
                props.openCardModal(details)
            }}>
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
                            {details.scanType}
                        </Grid.Row>
                        {getStatusElement()}
                    </Grid>
                </Card.Content>
            </Card>
        </Tooltip>)
        ;

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
