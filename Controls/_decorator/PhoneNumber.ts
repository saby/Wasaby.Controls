import Phone from './Phone';
import {Logger} from 'UI/Utils';

class PhoneNumber extends Phone {
    constructor(...args) {
        super(args);
        Logger.error('Controls.decorator:PhoneNumber: Контрол был переименован. Используйте Controls.decorator:Phone', this);
    }
}
export = PhoneNumber;
