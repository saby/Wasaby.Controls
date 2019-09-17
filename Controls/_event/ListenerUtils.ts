import {Control} from 'UI/Base';

export function register(instance: Control, event: String, callback: Function) {
    instance._notify('register', [event, instance, callback], {bubbling: true});
}

export function unregister(instance: Control, event: String) {
    instance._notify('unregister', [event, instance], {bubbling: true});
}


