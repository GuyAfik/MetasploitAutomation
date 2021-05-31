const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;

/**
 * creates new user in the users database.
 * @param newUser - json with the user details
 *{
    "name": "Amit kremer",
    "password": "12345678",
    "email": "amit@gmail.com"
}
 * @returns {Promise<Response>}
 */
export function createUser(newUser) {
    return fetch('/Users/Create', {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
            name: newUser.name,
            password: newUser.newPass,
            email: newUser.email
        })
    })
}

/**
 * updates user's details
 * @param email - user's email
 * @param user - user json with updated details
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
 * @returns {Promise<Response>}
 */
export function updateUser(email, user) {
    return fetch(`/Users/Update/${email}`, {
        method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
            _id: user._id,
            data: user.data,
            name: user.name,
        })
    })
}

/**
 * gets the user json from the database. used by the login stage.
 * @param email - user's email
 * @param password - user's password
 * @returns {Promise<Response>} with the user's json
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
 */
export function getUser(email, password) {
    return fetch(`/Users/Get/${email}/${password}`)
}

/**
 * uses email regex to compare with the imput that the uses entered.
 * @param email - user's email
 * @returns {boolean} - if the email is valid or not
 */
export function isEmailValid(email) {
    return emailRegex.test(email)

}

export function createAWSInstance() {
    return fetch(`/DockerServerInstances/Create`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "ImageId": "ami-016b213e65284e9c9",
            "InstanceType": "t2.micro"
        })
    }).then(res => {
        if (res.ok) {
            return res;
        } else {
            throw new Error();
        }
    }).catch((err) => {
        throw new Error(err)
    })
}

export function removeAWSInstance(instanceId) {
    return fetch(`/DockerServerInstances/Delete/${instanceId}`, {
        method: 'DELETE'
    })
}

export function createMetasploitContainer(instanceId) {
    return fetch(`/DockerServerInstances/${instanceId}/Containers/CreateMetasploitContainer`, {
        method: 'POST'
    }).then(res => {
        if (res.ok) {
            return res;
        } else {
            throw new Error();
        }
    }).catch(err => {
        throw new Error(err);
    })
}

export function scanPorts(target, instanceId) {
    return fetch(`/DockerServerInstances/${instanceId}/Metasploit/${target}/ScanOpenPorts`, {
        method: 'GET'
    }).then(res => {
        if (res.ok) {
            return res
        } else {
            throw new Error();
        }
    }).catch(err => {
        throw new Error(err);
    })
}

export function dDosAttack(target, instanceId) {
    return fetch(`/DockerServerInstances/${instanceId}/Metasploit/${target}/RunAuxiliary`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "name": "dos/http/slowloris",
            "options": {
                "rhost": target
            }
        })
    }).then(res => {
        if (res.ok) {
            return res
        } else {
            throw new Error();
        }
    }).catch(err => {
        throw new Error(err);
    })
}

export function ftpAttack(target, instanceId, exploit, payload) {
    let exploitJson = "{\"name\":\"" + exploit + "\", \"payloads\": {\"" + payload + "\": {}}, \"options\": {\"RHOST\": " + target + "}}";
    return fetch(`/DockerServerInstances/${instanceId}/Metasploit/${target}/RunExploit`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: exploitJson
    }).then(res => {
        if (res.ok) {
            return res
        } else {
            throw new Error();
        }
    }).catch(err => {
        throw new Error(err);
    })
}

/**
 * gets array of containers that run on a specific ec2 instance
 * @param instanceId
 * @returns {Promise<* | void>}
 */
export function getContainersByInstance(instanceId) {
    return fetch(`/DockerServerInstances/${instanceId}/Containers/Get`, {
        method: 'GET'
    }).then(res => {
        if (res.ok) {
            return res
        } else {
            throw new Error();
        }
    }).catch(err => {
        throw new Error(err);
    })
}

/**
 * generates the current time as string
 * @returns {string} - "12:34:15"
 */
export function getCurrentTime() {
    let today = new Date();
    let stringifyCurrentTime = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    return stringifyCurrentTime;
}
