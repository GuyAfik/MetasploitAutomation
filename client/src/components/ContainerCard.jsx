import React from 'react';
import {Card, Grid, Icon} from "semantic-ui-react";
import Text from "antd/lib/typography/Text";

/**
 * Card for presenting containers to the user.
 * @param props - new container details
 * @returns {JSX.Element}
 * @constructor
 */
const ContainerCard = (props) => {
    const {details} = props;
    return (
        <Card raised={true} style={{width: 190}}>
            <Card.Content>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                    < Icon style={{alignSelf: 'center'}} size={"huge"} name='docker'/>
                    <Text style={{alignSelf: 'center'}}>{details.name}</Text>
                </div>
            </Card.Content>
            <Card.Content extra>
                <Grid columns={1} style={{
                    width: '100%'
                }}>
                    <Grid.Row>
                        < Icon style={{marginLeft: 10}} size={"large"} name='microchip'/>
                        {details.image[0]}
                    </Grid.Row>
                    {Object.keys(details.ports).map(port => {
                        return (<Grid.Row>
                            < Icon style={{marginLeft: 10}} size={"large"} name='shield alternate'/>
                            {port}
                        </Grid.Row>)
                    })}
                    <Grid.Row>
                        < Icon style={{marginLeft: 10}} size={"large"} name='heartbeat'/>
                        {details.status}
                    </Grid.Row>
                </Grid>
            </Card.Content>
        </Card>
    );
};

export default ContainerCard;
