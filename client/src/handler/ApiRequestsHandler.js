class ApiRequestsHandler {
    constructor(method, penTest) {
        this._pentest = penTest;
        this.updateCard = method;
    }

    startTest() {
        setTimeout(() => {
            let u1 = this._pentest;
            u1 = {...u1, status: 'finished'};
            this.updateCard(u1);
        }, 7000);
    }
}

export default ApiRequestsHandler;
