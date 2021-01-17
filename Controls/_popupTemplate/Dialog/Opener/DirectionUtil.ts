import {IDialogPopupOptions} from 'Controls/popup';

const DIRECTION_TO_POSITION_MAP = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left'
};

export enum HORIZONTAL_DIRECTION {
    LEFT = 'left',
    RIGHT = 'right',
    CENTER = 'center'
}

export enum VERTICAL_DIRECTION {
    TOP = 'top',
    BOTTOM = 'bottom',
    CENTER = 'center'
}

/**
 * Получение набора свойст в которых хранятся названия свойств отвечающих за позиционирование попапа.
 * @param {IDirection} direction
 * @return {IDirection}
 */
export function getPositionProperties(
    direction: IDialogPopupOptions['direction'] = {
        horizontal: HORIZONTAL_DIRECTION.RIGHT,
        vertical: VERTICAL_DIRECTION.BOTTOM
    }
): IDialogPopupOptions['direction'] {
    return {
        horizontal: DIRECTION_TO_POSITION_MAP[direction.horizontal] || HORIZONTAL_DIRECTION.RIGHT,
        vertical: DIRECTION_TO_POSITION_MAP[direction.vertical] || VERTICAL_DIRECTION.BOTTOM
    };
}
