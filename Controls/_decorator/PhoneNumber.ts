import Phone from './Phone';
import {IoC} from 'Env/Env';

class PhoneNumber extends Phone {
    constructor(...args) {
        super(args);
        IoC.resolve('ILogger').error('Controls.decorator:PhoneNumber', 'Контрол был переименован. Используйте Controls.decorator:Phone');
    }
}
export = PhoneNumber;
