import {TActionCaptionPosition} from './IItemActions';

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
