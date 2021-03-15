import React from 'react'
import {Button, Typography, Divider, Empty, Tooltip} from 'antd';
import {connect} from "react-redux";
import {addCard} from "../actions/cardsActions";
import {openSideDrawer} from "../actions/sideDrawerActions";
import SideDrawer from "../components/SideDrawer";
import CustomCard from "../components/CustomCard";
import {PlusOutlined} from '@ant-design/icons';

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
            {props.cardR.cards.map((card, index) => {
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
    return (
        <div style={{width: '100%', display: 'block'}}>
            <SideDrawer/>
            <div style={{display: "flex"}}>
                <Title level={4} style={{color: "#91d5ff", marginLeft: 20}}>Home</Title>
            </div>
            <Divider/>
            {props.cardR.cards.length === 0 ? emptyPage() : nonEmptyPage(props)}
            <div style={{position: 'fixed', bottom: '40px', right: '40px'}}>
                <Tooltip title={"Create new PenTest"}>
                    <Button type="primary" shape={'circle'} size={'large'} icon={<PlusOutlined/>} onClick={() => {
                        props.open()
                    }}/>
                </Tooltip>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        cardR: state.cardsReducer,
        sideDrawerR: state.sideDrawerReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        addCard: (card) => {
            dispatch(addCard(card))
        },
        open: () => {
            dispatch(openSideDrawer())
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
