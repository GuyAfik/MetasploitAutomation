export function addEC2(ec2) {
    return {
        type: 'ADD_EC2',
        payload: ec2
    }
}

export function removeEC2(ec2) {
    return {
        type: 'REMOVE_EC2',
        payload: ec2
    }
}
