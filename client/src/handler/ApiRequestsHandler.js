class ApiRequestsHandler {
    constructor(updateCard, penTestCard) {
        this._penTestCard = penTestCard;
        this._updateCard = updateCard;
    }

    startTest() {
        //simulate api request
        setTimeout(() => {
            let u1 = this._penTestCard;
            u1 = {...u1, status: 'finished'};
            this._updateCard(u1);

        }, 3000);
    }
}

export default ApiRequestsHandler;
