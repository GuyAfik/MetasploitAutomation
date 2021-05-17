import {updateUser} from "../Utils/Utils";

const user = {};

/**
 * a reducer that handles all of the user related states.
 * @param state - the user state at a given time.
 * {
    "_id": "a6bf706080b7333846578b028ad45d25a7a4d4cde9fc6c604e8a1995217bdc8c",
    "data": {
        "cards": [
           {
                "description": "Just a dummy test",
                "endTime": "12:48",
                "scanType": "ports scanning",
                "id": 1620386259941,
                "ip": "195.95.193.250",
                "name": "test",
                "results": [
                    "195.95.193.250:80",
                    "195.95.193.250:443"
                ],
                "startTime": "12:23",
                "status": {
                    "description": "Finished",
                    "state": "Finished"
                }
            }
        ]
    },
    "name": "Amit"
}
 * @param action - action that changes the state
 * @returns {{}}
 */
const userReducer = (state = user, action) => {
    switch (action.type) {
        case "ADD_CARD":
            state = {
                ...state,
                data: {cards: [...state.data.cards, action.payload]}
            }
            break;
        case "NEW_SESSION":
            state = action.payload
            if (!state.data.cards) {
                state = {...state, data: {cards: []}}
            }
            break;
        case "SAVE_EMAIL":
            state = {
                ...state,
                email: action.payload
            }
            break;
        case "UPDATE_CARD":
            let newCard = action.payload;
            state = {
                ...state,
                data: {
                    cards: state.data.cards.map((card, i) => card.id === newCard.id ? {...card = newCard} : card)
                }
            }
            updateUser(state.email, state).then(res => {
                if (res.ok) {
                    console.log("user updated on server");
                } else {
                    console.log("user didnt update on server");
                }
            })
            break;
        default:
            break;
    }
    return state;
};
export default userReducer;
