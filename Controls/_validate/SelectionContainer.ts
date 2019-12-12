import Container from 'Controls/_validate/Container';
import {TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_validate/SelectionContainer');

/**
 * Контрол, регулирующий валидацию своего контента.
 * Используется с контролами, поддерживающими интерфейс {@link Controls/interface/IMultiSelectable IMultiSelectable}.
 * Автоматически запускает валидацию при смене значения в контроле и при его деактивации.
 * @class Controls/_validate/SelectionContainer
 * @extends Controls/_validate/Container
 * @control
 * @public
 * @author Красильников А.С.
 */

class Selection extends Container {
    _template: TemplateFunction = template;
    _shouldValidate: boolean;

    _deactivatedHandler(): void {
        this._shouldValidate = true;
        this._forceUpdate();
    }

    _selectedKeysChangedHandler(event: Event, value: string): void {
        this._notify('selectedKeysChanged', [value]);
        this._cleanValid();
    }

    _selectedKeyChangedHandler(event: Event, value: string): void {
        this._notify('selectedKeyChanged', [value]);
        this._cleanValid();
    }

    protected _afterUpdate(): void {
        if (this._shouldValidate) {
            this._shouldValidate = false;
            this.validate();
        }
    }
}

export default Selection;
