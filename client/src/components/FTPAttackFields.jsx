// import {Col, Form, Row, Select} from "antd";
// import {EXPLOITS} from "../Utils/Constants";
// import React, {useEffect} from "react";
//
// const FTPAttackFields = (props) => {
//     const {exploit, payload, setExploitForPenTest, setPayloadForPenTest} = props;
//
//     useEffect(() => {
//         console.log("ldldldl")
//     }, []);
//
//     const handleExploitChanged = (exploit) => {
//         setExploitForPenTest(exploit)
//     }
//
//     const handlePayloadChanged = (payload) => {
//         setPayloadForPenTest(payload)
//     }
//
//     return (<Row gutter={16}>
//         <Col span={12}>
//             <Form.Item
//                 name="exploit"
//                 label="Exploit"
//                 rules={[{required: true, message: 'Exploit can\'t be empty!',}]}
//             >
//                 <Select onChange={exploit => handleExploitChanged(exploit)} defaultValue={EXPLOITS[0]}>
//                     {EXPLOITS.map(exploit => {
//                         return <Option value={exploit}>{exploit}</Option>
//                     })}
//                 </Select>
//             </Form.Item>
//         </Col>
//         <Col span={12}>
//             <Form.Item
//                 name="payload"
//                 label="Payload"
//                 rules={[{required: true, message: 'Payload can\'t be empty!',}]}
//             >
//                 <Select onChange={payload => handlePayloadChanged(payload)} value={payload}>
//                     {exploit.map(payload => {
//                         return <Option value={payload}>{payload}</Option>
//                     })}
//                 </Select>
//             </Form.Item>
//         </Col>
//     </Row>);
// }
//
// export default FTPAttackFields;
