import {
    createAWSInstance,
    createMetasploitContainer,
    createUser, dDosAttack, ftpAttack, getContainersByInstance, getCurrentTime,
    getUser,
    isEmailValid,
    removeAWSInstance, scanPorts,
    updateUser
} from "../Utils/Utils";
import {beforeEach, describe, jest, test} from '@jest/globals';


describe('test', () => {
    test('Create new user', () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({name: "amit"}),
            })
        );
        const newUser = {name: "amit"};
        expect(createUser).toBeDefined()
        createUser(newUser).then(data => data.json().then(res => expect(res).toEqual(newUser)));

    });

    test('Update user', () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({status: 200}),
            })
        );
        const userToUpdate = {_id: 123, data: {}, name: "test"}
        expect(updateUser).toBeDefined()
        updateUser("test@test.com", "amitk").then(data => data.json().then(res => expect(res.status).toEqual(200)));
    });

    test('Get specific user', () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({name: "amit", data: {number: 2}}),
            })
        );
        expect(getUser).toBeDefined()
        getUser("test@test.com", "123456").then(data => data.json().then(res => {
            expect(res.name).toEqual("amit")
            expect(res.data.number).toEqual(2)
        }));
    });

    test('Test email validator', () => {
        expect(isEmailValid).toBeDefined()
        expect(isEmailValid("amit@gmail.com")).toBeTruthy()
        expect(isEmailValid("@gmail.com")).toBeFalsy()
        expect(isEmailValid("amitgmail.co")).toBeFalsy()
    });

    test('Create aws instance', () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({status: 200}),
            })
        );
        expect(createAWSInstance).toBeDefined()
        createAWSInstance().then(data => data.json().then(res => expect(res.status).toEqual(200)));
    });

    test('Remove aws instance', () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({status: 200}),
            })
        );
        expect(removeAWSInstance).toBeDefined()
        removeAWSInstance().then(data => data.json().then(res => expect(res.status).toEqual(200)));
    });

    test('Create metasploit container', () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({id: "id-123456"}),
            })
        );
        expect(createMetasploitContainer).toBeDefined()
        createMetasploitContainer().then(data => data.json().then(res => expect(res.id).toEqual("id-123456")));
    });

    test('Scan ports API', () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({res: 80}),
            })
        );
        expect(scanPorts).toBeDefined()
        scanPorts("885.55.2.5", "id-123456").then(data => data.json().then(res => expect(res.res).toEqual(80)));
    });

    test('dDos attack API', () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({status: 200}),
            })
        );
        expect(dDosAttack).toBeDefined()
        dDosAttack("885.55.2.5", "id-123456").then(data => data.json().then(res => expect(res.status).toEqual(200)));
    });

    test('ftp attack API', () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({status: 200}),
            })
        );
        expect(ftpAttack).toBeDefined()
        ftpAttack("885.55.2.5", "id-123456", "exploit", "payload").then(data => data.json().then(res => expect(res.status).toEqual(200)));
    });

    test('get container by instance', () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({container: {id: 123456}}),
            })
        );
        expect(getContainersByInstance).toBeDefined()
        getContainersByInstance("id-123456").then(data => data.json().then(res => expect(res.container.id).toEqual(123456)));
    });

    test('Test getCurrentTime', () => {
        expect(getCurrentTime).toBeDefined()
    });
});
