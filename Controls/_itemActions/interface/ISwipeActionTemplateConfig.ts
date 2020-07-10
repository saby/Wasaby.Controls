import {TActionCaptionPosition} from './IItemActions';

export interface ISwipeActionTemplateConfig {
    theme: string;
    paddingSize: 's'|'m'|'l';
    hasActionWithIcon: boolean;
    actionCaptionPosition: TActionCaptionPosition;
    itemActionsSize?: 's'|'m'|'l';
    actionAlignment?: 'horizontal'|'vertical';
    needIcon?: Function;
    needTitle?: Function;
}
