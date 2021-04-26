import {createAWSInstance, createMetasploitContainer, removeAWSInstance, scanPorts} from "../Utils/Utils";

class ApiRequestsHandler {
    constructor(updateCard, penTestCard) {
        this._penTestCard = penTestCard;
        this._updateCard = updateCard;
        this._instanceId = null;
    }

    startTest() {
        switch (this._penTestCard.exploit) {
            case "ports scanning":
                this.portScanning();
                break;
            default:
                break;
        }
    }

    portScanning() {
        this.updatePenTestStatus({state: "running", description: "Starting AWS instance"});
        createAWSInstance().then(res => {
            if (res.ok) {
                console.log(res);
                res.json().then(instance => {
                    console.log(instance);
                    this._instanceId = instance._id;
                    this.updatePenTestStatus({state: "running", description: "Creating Metasploit Container"});
                    createMetasploitContainer(instance._id).then(res => {
                        if (res.ok) {
                            scanPorts(this._penTestCard.ip, instance._id).then(res => {
                                if (res.ok) {
                                    res.json().then(portScanResult => {
                                        console.log(portScanResult);
                                        this.updatePenTestStatus({
                                            state: "Finished",
                                            description: "Finished"
                                        }, portScanResult);
                                    });
                                } else {
                                    this.updatePenTestStatus({
                                        state: "Failed",
                                        description: "Cannot run port scan"
                                    });
                                }
                            }).finally(() => this.removeAWSInstance());
                        } else {
                            this.updatePenTestStatus({
                                state: "Failed",
                                description: "Cannot Create Metasploit Container"
                            });
                        }
                    })
                })
            } else {
                this.updatePenTestStatus({state: "Failed", description: "Cannot start AWS instance"});
            }
        })
    }

    updatePenTestStatus(status, results = null) {
        let penTest = this._penTestCard;
        penTest = {...penTest, status: status}
        if (results !== null) {
            penTest = {...penTest, results: results};
        }
        this._updateCard(penTest);
        this._penTestCard = penTest;
    }

    async removeAWSInstance() {
        let res = await removeAWSInstance(this._instanceId)
        console.log("AWS instance removed");
    }
}

export default ApiRequestsHandler;
