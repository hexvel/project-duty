import { API } from 'vk-io';

export class Events {
    constructor(token, event) {
        this.token = token
        this.api = new API({token: this.token})
        this.event = event
    }

    getUserId() {
        return this.event['user_id']
    }

    getSecret() {
        return this.event['secret'];
    }

    getMethod() {
        return this.event['method'];
    }
}