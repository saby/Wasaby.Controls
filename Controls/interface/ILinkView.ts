import dateControlsUtils = require('Controls/Calendar/Utils');

import {descriptor} from 'Types/entity';

/**
 * @interface Controls/Input/Date/interface/ILinkView
 * @public
 */
interface ILinkView {
    /**
     * @name Controls/Input/Date/interface/ILinkView#style
     * @cfg {String} Display style of component.
     * @variant default Component display as default style.
     * @variant linkMain Component display as main link style.
     * @variant linkMain2 Component display as first nonaccent link style.
     * @variant linkAdditional Component display as third nonaccent link style.
     */
    style: string;
    linkClickable: boolean;

    /**
     * @name Controls/Input/Date/interface/ILinkView#showNextArrow
     * @cfg {Boolean} Display the control arrow to switch to the next period
     */
    showNextArrow: boolean;

    /**
     * @name Controls/Input/Date/interface/ILinkView#showPrevArrow
     * @cfg {Boolean} Display the control arrow to switch to the previous period
     */
    showPrevArrow: boolean;

    /**
     * @name Controls/Input/Date/interface/ILinkView#showDeleteButton
     * @cfg {Boolean} Enables or disables the display of the period clear button.
     */
    showDeleteButton: boolean;

    /**
     * @name Controls/Input/Date/interface/ILinkView#emptyCaption
     * @cfg {String} Text that is used if the period is not selected.
     */
    emptyCaption: string;

    /**
     * @name Controls/Input/Date/interface/ILinkView#captionFormatter
     * @cfg {Function} Caption formatting function.
     */
    captionFormatter: Function;
}

const EMPTY_CAPTIONS = {
    NOT_SPECIFIED: rk('Не указан'),
    NOT_SELECTED: rk('Не выбран'),
    WITHOUT_DUE_DATE: rk('Бессрочно', 'ShortForm'),
    ALL_TIME: rk('Весь период')
};

function getDefaultOptions(): ILinkView {
    return {
        style: undefined,
        linkClickable: true,
        showNextArrow: false,
        showPrevArrow: false,
        showDeleteButton: true,
        emptyCaption: EMPTY_CAPTIONS.NOT_SPECIFIED,
        captionFormatter: dateControlsUtils.formatDateRangeCaption
    };
}

function getOptionTypes() {
    return {
        style: descriptor(String).oneOf([
            'default',
            'linkMain',
            'linkMain2',
            'linkAdditional',
            'secondary'
        ]),
        linkClickable: descriptor(Boolean),
        showNextArrow: descriptor(Boolean),
        showPrevArrow: descriptor(Boolean),
        showDeleteButton: descriptor(Boolean),
        emptyCaption: descriptor(String),
        captionFormatter: descriptor(Function)
    };
}

export = {
    EMPTY_CAPTIONS,
    getOptionTypes,
    getDefaultOptions
};
