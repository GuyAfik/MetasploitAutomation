import React from 'react';
import {Alert, Input, Modal, Space} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {closeCardModal} from "../actions/modalsActions";
import {connect} from "react-redux";

const CardDetailsModal = (props) => {
    const card = props.modalsR.cardModal.cardDetails;
    return (
        <>
            <Modal
                centered
                title="Pentest details"
                visible={props.modalsR.cardModal.isOpen}
                onOk={() => props.closeCardModal()}
                onCancel={() => props.closeCardModal()}
            >
                <div style={{display: "flex", alignSelf: "center", flexDirection: "column", width: '100%'}}>
                    {JSON.stringify(card)}
                </div>
            </Modal>
        </>
    );
};
const mapStateToProps = (state) => {
    return {modalsR: state.modalsReducer};
}

const mapDispatchToProps = (dispatch) => {
    return {
        closeCardModal: () => {
            dispatch(closeCardModal())
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CardDetailsModal);
