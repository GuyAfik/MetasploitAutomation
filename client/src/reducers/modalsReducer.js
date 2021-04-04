const initialState = {
    newUserModal: {isOpen: false,},
    cardModal: {
        isOpen: false,
        cardDetails: {}
    }
}

const modalsReducer = (state = initialState, action) => {
    switch (action.type) {
        case "OPEN":
            state = {
                ...state,
                newUserModal: {isOpen: true}
            }
            break;
        case "CLOSE":
            state = {
                ...state,
                newUserModal: {isOpen: false}
            }
            break;
        case "OPEN_CARD_MODAL":
            state = {
                ...state,
                cardModal: {
                    isOpen: true,
                    cardDetails: action.payload
                }
            }
            break;
        case "CLOSE_CARD_MODAL":
            state = {
                ...state,
                cardModal: {
                    isOpen: false
                }
            }
            break;
        default:
            break;
    }

    return state;
}
export default modalsReducer;
