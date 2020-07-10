import {TActionCaptionPosition} from './IItemActions';

export interface ISwipeActionTemplateConfig {
    theme: string,
    paddingSize: 's'|'m'|'l',
    hasActionWithIcon: boolean,
    itemActionsSize?: 's'|'m'|'l';
    actionAlignment?: 'horizontal'|'vertical';
    actionCaptionPosition: TActionCaptionPosition,
    needIcon?: Function,
    needTitle?: Function
}
