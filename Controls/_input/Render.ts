import {detection} from 'Env/Env';
import {descriptor} from 'Types/entity';
import {SyntheticEvent} from 'Vdom/Vdom';
import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as ActualAPI from 'Controls/_input/ActualAPI';
import {
    TBorderVisibility, IBorderVisibility, IBorderVisibilityOptions,
    getDefaultBorderVisibilityOptions, getOptionBorderVisibilityTypes,
    IHeight, IHeightOptions, IFontColorStyle,
    IFontColorStyleOptions, IFontSize, IFontSizeOptions,
    IBorderStyle, IBorderStyleOptions, IValidationStatus, IValidationStatusOptions
} from 'Controls/interface';

import * as template from 'wml!Controls/_input/Render/Render';

type State =
    'valid'
    | 'valid-active'
    | 'invalid'
    | 'invalid-active'
    | 'invalidAccent'
    | 'invalidAccent-active'
    | 'readonly'
    | 'readonly-multiline'
    | 'success'
    | 'secondary'
    | 'warning';

export interface IBorder {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
}

interface IRenderOptions extends IControlOptions, IHeightOptions, IBorderVisibilityOptions,
    IFontColorStyleOptions, IFontSizeOptions, IValidationStatusOptions, IBorderStyleOptions {
    /**
     * @name Controls/_input/Render#multiline
     * @cfg {Boolean} Определяет режим рендеринга текстового поля.
     * @remark
     * * false - однострочный режим.
     * * true - многострочный режим.
     */
    multiline: boolean;
    /**
     * @name Controls/_input/Render#roundBorder
     * @cfg {Boolean} Определяет скругление рамки текстого поля.
     * @remark
     * * false - квадратная рамка.
     * * true - круглая рамка.
     */
    roundBorder: boolean;

    /**
     * @name Controls/_input/Render#content
     * @cfg {HTMLElement} Шаблон текстового поля
     */
    content: TemplateFunction;
    /**
     * @name Controls/_input/Render#leftFieldWrapper
     * @cfg {HTMLElement}
     */
    leftFieldWrapper?: TemplateFunction;
    /**
     * @name Controls/_input/Render#rightFieldWrapper
     * @cfg {HTMLElement}
     */
    rightFieldWrapper?: TemplateFunction;
    state: string;
    border: IBorder;
}

/**
 * Контрол для рендеринга текстового поля.
 *
 * @class Controls/_input/Render
 * @extends UI/_base/Control
 *
 * @mixes Controls/_interface/IHeight
 * @mixes Controls/_interface/IFontSize
 * @mixes Controls/_interface/IFontColorStyle
 * @mixes Controls/_input/interface/ITag
 * @mixes Controls/_interface/IValidationStatus
 * @mixes Controls/interface/IBorderStyle
 * @mixes Controls/interface/IBorderVisibility
 *
 * @author Красильников А.С.
 * @private
 */

class Render extends Control<IRenderOptions> implements IHeight, IFontColorStyle, IFontSize, IValidationStatus, IBorderStyle, IBorderVisibility {
    protected _tag: SVGElement | null = null;
    private _border: IBorder = null;
    private _contentActive: boolean = false;

    protected _state: string;
    protected _statePrefix: string;
    protected _fontSize: string;
    protected _inlineHeight: string;
    protected _fontColorStyle: string;
    protected _validationStatus: string;
    protected _template: TemplateFunction = template;
    protected _theme: string[] = ['Controls/input', 'Controls/Classes'];

    readonly '[Controls/_interface/IHeight]': boolean = true;
    readonly '[Controls/_interface/IFontSize]': boolean = true;
    readonly '[Controls/_interface/IFontColorStyle]': boolean = true;
    readonly '[Controls/_interface/IValidationStatus]': boolean = true;
    readonly '[Controls/interface/IBorderStyle]': boolean = true;
    readonly '[Controls/interface/IBorderVisibility]': boolean = true;

    private updateState(options: IRenderOptions): void {
        this._border = Render._detectToBorder(options.borderVisibility, options.multiline);
        this._fontSize = ActualAPI.fontSize(options.fontStyle, options.fontSize);
        this._inlineHeight = ActualAPI.inlineHeight(options.size, options.inlineHeight);
        this._fontColorStyle = ActualAPI.fontColorStyle(options.fontStyle, options.fontColorStyle);
        this._validationStatus = ActualAPI.validationStatus(options.style, options.validationStatus);

        if (options.state === '') {
            this._state = `${this.calcState(options)}`;
            this._statePrefix = '';
        } else {
            this._state = `${options.state}-${this.calcState(options)}`;
            this._statePrefix = `_${options.state}`;
        }
    }

    private calcState(options: IRenderOptions): State {
        if (options.readOnly) {
            if (options.multiline) {
                return 'readonly-multiline';
            }

            return 'readonly';
        }
        if (options.borderStyle && this._validationStatus === 'valid') {
            return options.borderStyle;
        }

        if (this._contentActive && Render.notSupportFocusWithin()) {
            return this._validationStatus + '-active';
        }
        return this._validationStatus;
    }

    protected _tagClickHandler(event: SyntheticEvent<MouseEvent>): void {
        this._notify('tagClick', [this._children.tag]);
    }

    protected _tagHoverHandler(event: SyntheticEvent<MouseEvent>): void {
        this._notify('tagHover', [this._children.tag]);
    }

    protected _beforeMount(options: IRenderOptions): void {
        this.updateState(options);
    }

    protected _beforeUpdate(options: IRenderOptions): void {
        this.updateState(options);
    }

    protected _setContentActive(event: SyntheticEvent<FocusEvent>, newContentActive: boolean): void {
        this._contentActive = newContentActive;

        this.updateState(this._options);
    }

    private static notSupportFocusWithin(): boolean {
        return detection.isIE || (detection.isWinXP && detection.yandex);
    }

    private static _detectToBorder(borderVisibility: TBorderVisibility, multiline: boolean): IBorder {
        switch (borderVisibility) {
            case 'visible':
                return {
                    top: true,
                    right: true,
                    bottom: true,
                    left: true
                };
            case 'partial':
                return {
                    top: multiline,
                    right: false,
                    bottom: true,
                    left: false
                };
            case 'hidden':
                return {
                    top: false,
                    right: false,
                    bottom: false,
                    left: false
                };
        }
    }

    static getDefaultTypes(): object {
        return {
            ...getOptionBorderVisibilityTypes(),
            content: descriptor(Function).required(),
            rightFieldWrapper: descriptor(Function),
            leftFieldWrapper: descriptor(Function),
            multiline: descriptor(Boolean).required(),
            roundBorder: descriptor(Boolean).required()
        };
    }

    static getDefaultOptions(): object {
        return {
            ...getDefaultBorderVisibilityOptions(),
            state: ''
        };
    }
}

export default Render;
