const initialState = {
    newUserModal: {isOpen: false,},
    cardModal: {
        isOpen: false,
        cardDetails: {}
    }
}
/**
 * reducer the handles the state of the card report.
 * @param state - open or close, the the card details to display
 * @param action
 * @returns {{newUserModal: {isOpen: boolean}, cardModal: {isOpen: boolean, cardDetails: {}}}}
 */
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
                    ...state.cardModal,
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
