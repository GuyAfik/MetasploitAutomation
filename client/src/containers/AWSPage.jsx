import React, {useEffect, useState} from "react";
import {Spin, Divider, Empty, Typography} from 'antd';
import {connect} from "react-redux";
import {addEC2, removeEC2} from "../actions/awsActions";
import ContainerCard from "../components/ContainerCard";
import {getContainersByInstance} from "../Utils/Utils";

const {Title} = Typography;
/**
 * renders login animation
 * @returns {JSX.Element}
 */
const renderLoading = () => {
    return (<div style={{height: '80vh', width: '100%', display: "flex", justifyContent: "center"}}>
        <Spin style={{alignSelf: "center"}} size="large" tip={"Loading..."}/>
    </div>);
}
/**
 * gets array of json containers and renders them to the screen. if the array is empty will return empty icon
 * @param array - json array of containers
 * @returns {JSX.Element}
 */
const renderContainersArray = (array) => {
    if (array.length === 0) {
        return (
            <div style={{height: '80vh', width: '100%', display: "flex", justifyContent: "center"}}>
                <Empty style={{alignSelf: "center"}}/>
            </div>);
    } else {
        return (
            <div style={{
                height: '70vh',
                width: '100%',
                display: 'flex',
                alignContent: 'flex-start',
                justifyContent: 'flex-start',
                flexWrap: 'wrap'
            }}>
                {array.map((card, index) => {
                    return (
                        <div style={{margin: 10}}>
                            {/*<ContainerCard details={card}/>*/}
                            <ContainerCard
                                details={{_id: '123456789', IpParameters: '111111', State: {Name: 'amittt'}}}/>
                        </div>
                    )
                })}
            </div>);
    }
}

const AWSPage = (props) => {
    const [ec2Array, setEc2Array] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * fetches container's details from server. runs over the ec2 id array and asks for containers data.
     */
    useEffect(() => {
        setIsLoading(true);
        if (props.awsR.ec2Instances.length !== 0) {
            let promises = props.awsR.ec2Instances.map((ec2, index) => new Promise((resolve, reject) => {
                getContainersByInstance(ec2).then(containers => {
                    containers.json().then(arr => {
                        arr.map((container, index) => {
                            setEc2Array(prevArr => [...prevArr, container]);
                            resolve(null);
                        })
                    });
                }).catch(() => {
                    reject(null);
                })
            }))
            Promise.all(promises).then(() => {
                console.log("done");
                setIsLoading(false);
            }).catch(() => {
                console.log("no containers");
                setIsLoading(false);
            })
        } else {
            setIsLoading(false);
        }
        return (() => {
            props.removeEc2("i-0cc3a1a18dcf4bf0b");
        });
    }, []);

    return (
        <div style={{width: '100%'}}>
            <div style={{display: "flex"}}>
                <Title level={4} style={{color: "#91d5ff", marginLeft: 20}}>AWS</Title>
            </div>
            <Divider/>
            {isLoading ? renderLoading() : renderContainersArray(ec2Array)}
        </div>);

}

const mapStateToProps = (state) => {
    return {awsR: state.awsReducer};
}

const mapDispatchToProps = (dispatch) => {
    return {
        addEc2: (ec2) => {
            dispatch(addEC2(ec2))
        },
        removeEc2: (ec2) => {
            dispatch(removeEC2(ec2));
        }
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(AWSPage);
