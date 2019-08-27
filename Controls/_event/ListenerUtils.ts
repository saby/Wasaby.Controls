import {Control, IControlOptions} from 'UI/Base';

class ListenerUtils extends Control {
    //It is listener without template, because additional <div> can affects on display of the content.
    static register(instance: Control, event: String, callback: Function) {
        instance._notify('register', [event, instance, callback], {bubbling: true});
    }

    static unregister(instance: Control, event: String) {
        instance._notify('unregister', [event, instance], {bubbling: true});
    }

}

export default ListenerUtils;


