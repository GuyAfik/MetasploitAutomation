export function openNewUserModal() {
    return {type: "OPEN"}
}

export function closeNewUserModal() {
    return {type: "CLOSE"}
}

export function openCardModal(cardDetails) {
    return {type: "OPEN_CARD_MODAL", payload: cardDetails}
}

export function closeCardModal() {
    return {type: "CLOSE_CARD_MODAL"}
}
