import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { SwipeVerticalMeasurer, SwipeHorizontalMeasurer } from 'Controls/list';

import template = require('wml!Controls/_listRender/Containers/Swipe/Swipe');

import { SyntheticEvent } from 'Vdom/Vdom';
import { CollectionItem, Collection, ItemActionsController } from 'Controls/display';
import { Model } from 'Types/entity';

import { SwipeController } from 'Controls/display'

import * as itemActionsUtil from './ItemActions/processItemActions';

interface ISwipeEvent extends Event {
    direction: string;
}

interface ISwipeControlOptions extends IControlOptions {
    listModel: Collection<Model>;

    itemActionsPosition?: string;
    actionAlignment?: string;
    actionCaptionPosition?: string;

    menuIsShown?: boolean;
}

export default class SwipeControl extends Control<ISwipeControlOptions> {
    protected _template: TemplateFunction = template;

    // TODO React to collection change here or in the manager
    protected _animationState: string = 'close';
    protected _actionAlignment: string;
    protected _measurer: (typeof SwipeVerticalMeasurer.default | typeof SwipeHorizontalMeasurer.default);
    // TODO Import ISwipeConfig
    protected _swipeConfig: any;

    protected _needTitle: Function;
    protected _needIcon: Function;

    protected _beforeMount(): void {
        this._needTitle = (...args) => this._measurer.needTitle(...args);
        this._needIcon = (...args) => this._measurer.needIcon(...args);
    }

    protected _beforeUpdate(newOptions: ISwipeControlOptions): void {
        if (!newOptions.menuIsShown && this._options.menuIsShown) {
            this._resetSwipeState(newOptions.listModel);
        }
    }

    protected _onItemSwipe(
        event: SyntheticEvent<null>,
        item: CollectionItem<Model>,
        swipeEvent: SyntheticEvent<ISwipeEvent>
    ): void {
        if (swipeEvent.nativeEvent.direction === 'left' && item.getActions()) {
            this._openSwipe(item, swipeEvent);
        } else {
            this._closeSwipe(true);
        }
    }

    protected _onAnimationEnd(): void {
        if (this._animationState === 'close') {
            this._resetSwipeState(this._options.listModel);
        }
    }

    private _closeSwipe(animated: boolean = false): void {
        if (this._animationState === 'open' && !this._options.menuIsShown) {
            this._animationState = 'close';
            if (!animated) {
                this._resetSwipeState(this._options.listModel);
            }
        }
    }

    private _resetSwipeState(model: Collection<Model>): void {
        this._animationState = 'close';
        this._swipeConfig = null;
        // TODO Do we need this here?
        // this._notify('closeSwipe', [this._options.listModel.getSwipeItem()]);
        if (model && !model.destroyed) {
            SwipeController.setSwipeItem(model, null);
            ItemActionsController.setActiveItem(model, null);
        }
    }

    static getDefaultOptions(): Partial<ISwipeControlOptions> {
        return {
            itemActionsPosition: 'inside',
            actionAlignment: 'horizontal',
            actionCaptionPosition: 'none'
        };
    }
}
