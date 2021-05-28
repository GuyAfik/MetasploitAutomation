import {
    createAWSInstance,
    createMetasploitContainer,
    getCurrentTime,
    removeAWSInstance,
    scanPorts,
    ftpAttack, dDosAttack
} from "../Utils/Utils";

/**
 * ApiRequestsHandler is class that handles the requests to the server for all of the pentests sessions.
 * Every new pentest gets a unique instance of this class.
 */
class ApiRequestsHandler {
    constructor(updateCard, penTestCard, addEc2IdToStore, removeEc2IdFromStore) {
        this._penTestCard = penTestCard;
        this._updateCard = updateCard;
        this._instanceId = null;
        this._instance = null;
        this._addEc2IdToStore = addEc2IdToStore;
        this._removeEc2IdFromStore = removeEc2IdFromStore;
    }

    startTest() {
        switch (this._penTestCard.scanType) {
            case "ports scanning":
                this.beforeAndAfterRoutine(this.portScanning);
                break;
            case "ftp attack":
                this.beforeAndAfterRoutine(this.FTPAttack);
                break;
            case "Ddos":
                this.beforeAndAfterRoutine(this.dDosAttack);
                break;
            default:
                break;
        }
    }

    /**
     * performs dDos attack. this method called just after all of the preparations are completed
     */
    dDosAttack() {
        this.updatePenTestStatus({state: "running", description: "Run dDos attack"});
        dDosAttack(this._penTestCard.ip, this._instanceId).then(dDosAttackResult => {
            dDosAttackResult.json().then(dDosAttackResult => {
                this.updatePenTestStatus({
                    state: "Finished",
                    description: "Finished"
                }, dDosAttackResult);
            })
        }).catch(() => {
            this.updatePenTestStatus({
                state: "Failed",
                description: "Cannot run dDos Attack"
            })
        }).finally(() => {
            this.removeAWSInstance()
        })
    }

    /**
     * performs FTP attack. this method called just after all of the preparations are completed.
     * also updates the ui for test status
     */
    FTPAttack() {
        this.updatePenTestStatus({state: "running", description: "Run FTP attack"});
        ftpAttack(this._penTestCard.ip, this._instanceId, this._penTestCard.exploit, this._penTestCard.payload).then(ftpAttackResult => {
            ftpAttackResult.json().then(ftpAttackResult => {
                this.updatePenTestStatus({
                    state: "Finished",
                    description: "Finished"
                }, ftpAttackResult);
            })
        }).catch(() => {
            this.updatePenTestStatus({
                state: "Failed",
                description: "Cannot run FTP Attack"
            })
        }).finally(() => {
            this.removeAWSInstance()
        })
    }

    /**
     * performs port scan. this method called just after all of the preparations are completed.
     * also updates the ui for test status
     */
    portScanning() {
        this.updatePenTestStatus({state: "running", description: "Scanning"});
        scanPorts(this._penTestCard.ip, this._instanceId).then(portScanResult => {
            portScanResult.json().then(portScanResult => {
                this.updatePenTestStatus({
                    state: "Finished",
                    description: "Finished"
                }, portScanResult);
                console.log(portScanResult);
            });
        }).catch(() => {
            this.updatePenTestStatus({
                state: "Failed",
                description: "Cannot run port scan"
            })
        }).finally(() => {
            this.removeAWSInstance()
        })
    }

    /**
     * runs before every test and sets the foundations: starts an AWS ec2 machine, starts a metasploit container
     * and run the test.
     * @param specificAttack - ftp attack, dDos attack or port scan.
     */
    beforeAndAfterRoutine(specificAttack) {
        this.updatePenTestStatus({state: "running", description: "Starting AWS instance"});
        createAWSInstance().then(instance => {
            instance.json().then(instance => {
                this._instance = instance;
                this._addEc2IdToStore(instance._id);
                this._instanceId = instance._id;
                this.updatePenTestStatus({state: "running", description: "Creating Metasploit Container"});
                createMetasploitContainer(instance._id).then(container => {
                    container.json().then(container => {
                        specificAttack();
                    });
                }).catch(() => {
                    this.updatePenTestStatus({
                        state: "Failed",
                        description: "Cannot Create Metasploit Container"
                    });
                    this.removeAWSInstance()
                });
            });
        }).catch(() => {
            this.updatePenTestStatus({state: "Failed", description: "Cannot start AWS instance"});
        });
    }

    /**
     * updates the ui for every change in the pentest status. when the pentest ends it also sends the results.
     * @param status - json contains "status" and "description"
     * "status": {
                    "description": "Finished",
                    "state": "Finished"
                }
     * @param results - pentest result. an array of results that can be a json or a string
     * "results": [
     "195.95.193.250:80",
     "195.95.193.250:443"
     ]
     */
    updatePenTestStatus(status, results = null) {
        let penTest = this._penTestCard;
        penTest = {...penTest, status: status}
        if (status.state !== 'running') {
            penTest = {...penTest, endTime: getCurrentTime()}
        }
        if (results !== null) {
            penTest = {...penTest, results: results};
        }
        this._updateCard(penTest);
        this._penTestCard = penTest;
    }

    /**
     * shots down the ec2 machine from AWS and also removes the instance id from the store.
     * @returns {Promise<void>}
     */
    async removeAWSInstance() {
        this._removeEc2IdFromStore(this._instanceId);
        let res = await removeAWSInstance(this._instanceId)
        console.log("AWS instance removed");
    }
}

export default ApiRequestsHandler;
