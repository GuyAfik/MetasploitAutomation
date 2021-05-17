import React from 'react';
import {Modal} from "antd";
import {closeCardModal} from "../actions/modalsActions";
import {connect} from "react-redux";
import ReactJson from 'react-json-view'
import {Page, Text, View, Document, StyleSheet, PDFDownloadLink} from '@react-pdf/renderer';

const presentationReport = (card) => {
    return (<Document>
        <Page size="A4" style={styles.body}>
            <Text style={styles.title}>Scan Report</Text>
            <View style={styles.line}/>
            <Text style={styles.subTitle}>{card.description}</Text>
            <View style={styles.propsWrapper}>
                <View style={styles.smallPropsWrapper}>
                    <Text style={styles.text}>Start time: {card.startTime}</Text>
                    <Text style={styles.text}>End time: {card.endTime}</Text>
                </View>
                <View style={styles.smallPropsWrapper}>
                    <Text style={styles.text}>Scan name: {card.name}</Text>
                    <Text style={styles.text}>Target address: {card.ip}</Text>
                </View>
                <View style={styles.smallPropsWrapper}>
                    <Text style={styles.text}>Scan type: {card.scanType}</Text>
                    <Text style={styles.text}>Scan status: {card.status.description}</Text>
                </View>
            </View>
            <View style={styles.line}/>
            <Text style={styles.subTitle}>Results:</Text>
            <View style={styles.resultsWrapper}>
                <ReactJson src={card.results} name={'results'}/>
            </View>
        </Page>
    </Document>);

};

const downloadingReport = (card) => {
        return (<Document>
            <Page size="A4" style={styles.body}>
                <Text style={styles.title}>Scan Report</Text>
                <View style={styles.line}/>
                <Text style={styles.subTitle}>{card.description}</Text>
                <View style={styles.propsWrapper}>
                    <View style={styles.smallPropsWrapper}>
                        <Text style={styles.text}>Start time: {card.startTime}</Text>
                        <Text style={styles.text}>End time: {card.endTime}</Text>
                    </View>
                    <View style={styles.smallPropsWrapper}>
                        <Text style={styles.text}>Scan name: {card.name}</Text>
                        <Text style={styles.text}>Target address: {card.ip}</Text>
                    </View>
                    <View style={styles.smallPropsWrapper}>
                        <Text style={styles.text}>Scan type: {card.scanType}</Text>
                        <Text style={styles.text}>Scan status: {card.status.description}</Text>
                    </View>
                </View>
                <View style={styles.line}/>
                <Text style={styles.subTitle}>Results:</Text>
                <View style={styles.resultsWrapper}>
                    <Text style={styles.text}>{JSON.stringify(card.results, null, 2)}</Text>
                </View>
            </Page>
        </Document>);
    }
;

const CardDetailsModal = (props) => {
    const card = props.modalsR.cardModal.cardDetails;
    return (
        <>
            <Modal
                centered
                title="Report"
                visible={props.modalsR.cardModal.isOpen}
                onOk={() => props.closeCardModal()}
                onCancel={() => props.closeCardModal()}
                width={1000}
            >
                {card.status ? presentationReport(card) : null}
                {card.status ? <PDFDownloadLink document={downloadingReport(card)} fileName="Report.pdf">
                    {({blob, url, loading, error}) =>
                        loading ? 'Loading document...' : 'Download now!'
                    }
                </PDFDownloadLink> : null}
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

const styles = StyleSheet.create({
    body: {
        paddingBottom: 65,
        paddingHorizontal: 30,
        display: 'flex',
        flexDirection: 'column'
    },
    title: {
        fontSize: 44,
        margin: 20,
        textAlign: 'center'
    },
    subTitle: {
        fontSize: 22,
        margin: 20,
        textAlign: 'center'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    text: {
        margin: 12,
        fontSize: 12,
        textAlign: 'justify',
    },
    propsWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    smallPropsWrapper: {
        display: 'flex',
        flexDirection: 'column',
    },
    line: {
        display: 'flex',
        alignSelf: 'center',
        borderBottom: '1px solid #1890ff',
        width: '800px'
    },
    resultsWrapper: {
        padding: 50
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CardDetailsModal);
