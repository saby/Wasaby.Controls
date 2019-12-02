import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import Classes from './Button/Classes';
import {ActualApi, cssStyleGeneration} from 'Controls/buttons';
import ToggleButtonTemplate = require('wml!Controls/_toggle/Button/Button');
import {ICheckable, ICheckableOptions} from './interface/ICheckable';
import {ITooltip, ITooltipOptions, IButton, IButtonOptions, IIconStyle, IIconStyleOptions} from 'Controls/interface';
import {SyntheticEvent} from 'Vdom/Vdom';
import {constants} from 'Env/Env';

export interface IToggleButtonOptions extends IControlOptions, ICheckableOptions, ITooltipOptions, IButtonOptions, IIconStyleOptions {
    icons: string[];
    captions: string[];
    viewMode: string;
}

/**
 * Кнопка, которая переключается между двумя состояниями: включено и выключено.
 *
 * <a href="/materials/demo-ws4-buttons">Демо-пример</a>.
 *
 * @class Controls/_toggle/Button
 * @implements Controls/_toggle/interface/ICheckable
 * @implements Controls/_interface/ITooltip
 * @implements Controls/_interface/IButton
 * @implements Controls/_interface/IIconStyle
 * @control
 * @public
 * @author Красильников А.С.
 * @category Toggle
 *
 * @demo Controls-demo/Buttons/Toggle/ToggleButtonPG
 */

/*
 * Button that switches between two states: on-state and off-state.
 *
 * <a href="/materials/demo-ws4-buttons">Demo-example</a>.
 *
 * @class Controls/_toggle/Button
 * @implements Controls/_toggle/interface/ICheckable
 * @implements Controls/_interface/ITooltip
 * @implements Controls/_interface/IButton
 * @implements Controls/_interface/IIconStyle
 * @mixes Controls/_toggle/Button/Styles
 * @control
 * @public
 * @author Красильников А.С.
 * @category Toggle
 *
 * @demo Controls-demo/Buttons/Toggle/ToggleButtonPG
 */

/**
 * @name Controls/_toggle/Button#icons
 * @cfg {Array} Пара иконок.
 * Первая иконка отображается, когда переключатель выключен.
 * Вторая иконка отображается, когда переключатель включен.
 * @example
 * Переключатель с одной иконкой:
 * <pre>
 *    <Controls.toggle:Button icons="{{['icon-small icon-ArrangeList03']}}" viewMode="link"/>
 * </pre>
 * Переключатель с двумя иконками:
 * <pre>
 *    <Controls.toggle:Button icons="{{['icon-small icon-ArrangeList03', 'icon-small icon-ArrangeList04']}}" iconStyle="success" style="primary" viewMode="link"/>
 * </pre>
 */

/*
 * @name Controls/_toggle/Button#icons
 * @cfg {Array} Pair of icons.
 * First icon displayed when toggle switch is off.
 * Second icon displayed when toggle switch is on.
 * @example
 * Toggle button with one icon.
 * <pre>
 *    <Controls.toggle:Button icons="{{['icon-small icon-ArrangeList03']}}" viewMode="link"/>
 * </pre>
 * Toggle button with two icons.
 * <pre>
 *    <Controls.toggle:Button icons="{{['icon-small icon-ArrangeList03', 'icon-small icon-ArrangeList04']}}" iconStyle="success" style="primary" viewMode="link"/>
 * </pre>
 */

/**
 * @name Controls/_toggle/Button#captions
 * @cfg {Array} Пара заголовков.
 * Первый заголовок отображается, когда переключатель в состоянии "выключено".
 * Второй заголовок отображается, когда переключатель в состоянии "включено".
 * @example
 * Переключатель с двумя заголовками:
 * <pre>
 *    <Controls.toggle:Button readOnly="{{false}}" size="m" captions="{{['Change', 'Save']}}" style="info" viewMode="link"/>
 * </pre>
 * Переключатель с одним заголовком
 * <pre>
 *    <Controls.toggle:Button readOnly="{{false}}" size="m" captions="{{['Save']}}" style="info" viewMode="link"/>
 * </pre>
 */

/*
 * @name Controls/_toggle/Button#captions
 * @cfg {Array} Pair of captions.
 * First caption displayed when toggle switch is off.
 * Second caption displayed when toggle switch is on.
 * @example
 * Toggle button with two captions.
 * <pre>
 *    <Controls.toggle:Button readOnly="{{false}}" size="m" captions="{{['Change', 'Save']}}" style="info" viewMode="link"/>
 * </pre>
 * Toggle button with one caption.
 * <pre>
 *    <Controls.toggle:Button readOnly="{{false}}" size="m" captions="{{['Save']}}" style="info" viewMode="link"/>
 * </pre>
 */

/**
 * @name Controls/_toggle/Button#viewMode
 * @cfg {Enum} Кнопка переключения режима отображения.
 * @variant link Декорированная гиперссылка.
 * @variant pushButton Декорированная гиперссылка, преобразованная в кнопку на панели инструментов.
 * @variant toolButton Кнопка на панели инструментов.
 * @default link
 * @example
 * Кнопка-переключатель в режиме отображения - 'link'.
 * <pre>
 *    <Controls.toggle:Button captions="{{['Send document']}}" style="primary" viewMode="link" size="xl"/>
 * </pre>
 * Кнопка-переключатель в режиме отображения - 'toolButton'.
 * <pre>
 *    <Controls.toggle:Button captions="{{['Send document']}}" style="danger" viewMode="toolButton"/>
 * </pre>
 * Кнопка-переключатель в режиме отображения - 'pushButton'.
 * <pre>
 *    <Controls.toggle:Button captions="{{['Send document']}}" style="primary" viewMode="pushButton"/>
 * </pre>
 */

/*
 * @name Controls/_toggle/Button#viewMode
 * @cfg {Enum} Toggle button view mode.
 * @variant link Decorated hyperlink.
 * @variant pushButton Decorated hyperlink transform to toolbar button.
 * @variant toolButton Toolbar button.
 * @default link
 * @example
 * Toggle button with 'link' viewMode.
 * <pre>
 *    <Controls.toggle:Button captions="{{['Send document']}}" style="primary" viewMode="link" size="xl"/>
 * </pre>
 * Toggle button with 'toolButton' viewMode.
 * <pre>
 *    <Controls.toggle:Button captions="{{['Send document']}}" style="danger" viewMode="toolButton"/>
 * </pre>
 * Toggle button with 'pushButton' viewMode.
 * <pre>
 *    <Controls.toggle:Button captions="{{['Send document']}}" style="primary" viewMode="pushButton"/>
 * </pre>
 */
const stickyButton = [
    'pushButton',
    'toolButton'
];

class ToggleButton extends Control<IToggleButtonOptions> implements ICheckable {
    '[Controls/_toggle/interface/ICheckable]': true;
    '[Controls/_interface/IButton]': true;
    '[Controls/_interface/IIconStyle]': true;
    '[Controls/_interface/ITooltip]': true;

    // TODO https://online.sbis.ru/opendoc.html?guid=0e449eff-bd1e-4b59-8a48-5038e45cab22
    protected _template: TemplateFunction = ToggleButtonTemplate;

    protected _icon: string;
    protected _buttonStyle: string;
    protected _transparent: boolean;
    protected _viewMode: string;
    protected _state: string;
    protected _caption: string;
    protected _iconStyle: string;
    protected _hoverIcon: boolean = true;

    private _optionsGeneration(options: IToggleButtonOptions): void {
        const currentButtonClass = Classes.getCurrentButtonClass(options.style, this);

        // Называть _style нельзя, так как это состояние используется для темизации
        this._buttonStyle = currentButtonClass.style ? currentButtonClass.style : options.style;
        this._transparent = options.transparent;
        this._viewMode = currentButtonClass.style ? currentButtonClass.viewMode : options.viewMode;
        this._state = (stickyButton.indexOf(this._viewMode) !== -1 && options.value ? '_toggle_on' : '') + (options.readOnly ? '_readOnly' : '');
        this._caption = (options.captions ? (!options.value && options.captions[1] ? options.captions[1] : options.captions[0]) : '');
        this._icon = (options.icons ? (!options.value && options.icons[1] ? options.icons[1] : options.icons[0]) : '');
        this._iconStyle = ActualApi.iconStyleTransformation(options.iconStyle, true);
    }

    private _clickHandler(): void {
        if (!this._options.readOnly) {
            this._notify('valueChanged', [!this._options.value]);
        }
    }

    private _keyUpHandler(e: SyntheticEvent): void {
        if (e.nativeEvent.keyCode === constants.key.enter && !this._options.readOnly) {
            this._notify('click');
        }
    }

    protected _beforeMount(newOptions: IToggleButtonOptions): void {
        cssStyleGeneration.call(this, newOptions);

        const value = newOptions.value;
        this._icon = (newOptions.icons ? (!value && newOptions.icons[1] ? newOptions.icons[1] : newOptions.icons[0]) : '');
        this._hasIcon = !!this._icon;

        this._caption = (newOptions.captions ? (!newOptions.value && newOptions.captions[1] ? newOptions.captions[1] : newOptions.captions[0]) : '');
        this._stringCaption = typeof this._caption === 'string';

        this._iconSize = this._icon ? ActualApi.iconSize(newOptions) : '';
        this._iconStyle = this._icon ? ActualApi.iconStyle(newOptions) : '';

        if (this._options.viewMode === 'pushButton' || this._options.viewMode === 'toolButton') {
            this._hoverIcon = !newOptions.value;
        }
    }

    protected _beforeUpdate(newOptions: IToggleButtonOptions): void {
        cssStyleGeneration.call(this, newOptions);

        const value = newOptions.value;
        this._icon = (newOptions.icons ? (!value && newOptions.icons[1] ? newOptions.icons[1] : newOptions.icons[0]) : '');
        this._hasIcon = !!this._icon;

        this._caption = (newOptions.captions ? (!newOptions.value && newOptions.captions[1] ? newOptions.captions[1] : newOptions.captions[0]) : '');
        this._stringCaption = typeof this._caption === 'string';

        this._iconSize = this._icon ? ActualApi.iconSize(newOptions) : '';
        this._iconStyle = this._icon ? ActualApi.iconStyle(newOptions) : '';

        if (this._options.viewMode === 'pushButton' || this._options.viewMode === 'toolButton') {
            this._hoverIcon = !newOptions.value;
        }
    }

    static _theme: string[] = ['Controls/buttons', 'Controls/toggle'];

    static getDefaultOptions(): object {
        return {
            viewMode: 'button',
            iconStyle: 'secondary',
            theme: 'default'
        };
    }
}

export default ToggleButton;
