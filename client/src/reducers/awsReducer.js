const initialState = {
    ec2Instances: []
};

/**
 * aws reducer handles the state with all of the user's instances.
 * @param state - array of instance id's - ["id-97t", "id-ujn64eg"]
 * @param action
 * @returns {{ec2Instances: []}}
 */
const awsReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_EC2":
            state = {
                ...state,
                ec2Instances: [...state.ec2Instances, action.payload]
            }
            break;
        case "REMOVE_EC2":
            let arr = [...state.ec2Instances];
            let index = arr.indexOf(action.payload);
            if (index !== -1) {
                arr.splice(index, 1);
                state = {
                    ...state,
                    ec2Instances: arr
                }
            }
            break;
        default:
            break;
    }
    return state;
};
export default awsReducer;
