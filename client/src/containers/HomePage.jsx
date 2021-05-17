import React, {useEffect, useState} from 'react'
import {Button, Typography, Divider, Empty, Tooltip} from 'antd';
import {connect} from "react-redux";
import {addCard} from "../actions/userActions";
import {openSideDrawer} from "../actions/sideDrawerActions";
import SideDrawer from "../components/SideDrawer";
import CustomCard from "../components/CustomCard";
import {PlusOutlined} from '@ant-design/icons';
import {openCardModal} from "../actions/modalsActions";
import CardDetailsModal from "../components/CardDetailsModal";
import {Page, Text, View, Document, StyleSheet} from '@react-pdf/renderer';
import {addEC2} from "../actions/awsActions";

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});
const {Title} = Typography;

const nonEmptyPage = (props) => {
    return (
        <div style={{
            height: '70vh',
            width: '100%',
            display: 'flex',
            alignContent: 'flex-start',
            justifyContent: 'flex-start',
            flexWrap: 'wrap'
        }}>
            {props.userR.data.cards.map((card, index) => {
                return (
                    <div style={{margin: 10}}>
                        <CustomCard details={card}/>
                    </div>
                )
            })}
        </div>);
}

const emptyPage = () => {
    return (
        <div style={{height: '80vh', width: '100%', display: "flex", justifyContent: "center"}}>
            <Empty style={{alignSelf: "center"}}/>
        </div>);
}


const HomePage = (props) => {
    useEffect(() => {
        props.addEc2("i-0cc3a1a18dcf4bf0b")
    }, []);

    return (
        <div style={{width: '100%', display: 'block'}}>
            <SideDrawer/>
            <div style={{display: "flex"}}>
                <Title level={4} style={{color: "#91d5ff", marginLeft: 20}}>Home</Title>
            </div>
            <Divider/>
            {props.userR.data.cards.length === 0 ? emptyPage() : nonEmptyPage(props)}
            <div style={{position: 'fixed', bottom: '40px', right: '40px'}}>
                <Tooltip title={"Create new PenTest"}>
                    <Button type="primary" shape={'circle'} size={'large'} icon={<PlusOutlined/>} onClick={() => {
                        props.openSideDrawer()
                    }}/>
                </Tooltip>
            </div>
            <CardDetailsModal/>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        userR: state.userReducer,
        sideDrawerR: state.sideDrawerReducer,
        awsR: state.awsReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        addCard: (card) => {
            dispatch(addCard(card))
        },
        openSideDrawer: () => {
            dispatch(openSideDrawer())
        },
        openCardModal: (card) => {
            dispatch(openCardModal(card))
        },
        addEc2: (ec2) => {
            dispatch(addEC2(ec2))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
