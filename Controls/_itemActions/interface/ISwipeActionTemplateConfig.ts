import {TActionCaptionPosition} from './IItemAction';

export interface ISwipeActionTemplateConfig {
    theme: string;
    paddingSize: 's'|'m'|'l';
    actionCaptionPosition: TActionCaptionPosition;
    itemActionsSize?: 's'|'m'|'l';
    actionAlignment?: 'horizontal'|'vertical';
    hasActionWithIcon?: boolean;
    needIcon?: Function;
    needTitle?: Function;
}
