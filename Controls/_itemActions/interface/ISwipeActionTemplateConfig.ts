import {TActionCaptionPosition} from './IItemAction';
import {ISwipeConfig} from 'Controls/display';

export interface ISwipeActionTemplateConfig extends ISwipeConfig {
    theme?: string;
    actionCaptionPosition?: TActionCaptionPosition;
    actionAlignment?: 'horizontal'|'vertical';
    hasActionWithIcon?: boolean;
}
