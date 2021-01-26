import {IInputPlaceholder, IInputTag} from 'Controls/interface';

type IInputBase =
    IInputTag & IInputPlaceholder & {
    readonly _options: {
        textAlign: 'left' | 'right' | 'center';
        style: 'info' | 'invalid' | 'danger' | 'success' | 'warning' | 'primary'; //Todo нет такой опции больше
        autoComplete: 'on' | 'off' | 'username' | 'current-password';
        value: string | null;
    }
};

export default IInputBase;
