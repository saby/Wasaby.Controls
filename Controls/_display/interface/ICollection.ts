import {DestroyableMixin, ObservableMixin} from "Types/entity";
import IItemsStrategy from '../IItemsStrategy';
import {IEnumerable} from "../Abstract";

export type TItemKey = string | number;

export interface IBaseCollection<T> {
    each(cb: (item: T) => void): void;
    getItemBySourceKey(key: TItemKey): T;
    getCount(): number;
    find(predicate: (item: T) => boolean): T;
    getNext(item: T): T;
    getPrevious(item: T): T;
    nextVersion(): void;
}

export interface IStrategyCollection<T> {
    appendStrategy(strategy: Function, options?: object): void;
    getStrategyInstance(strategy: Function): IItemsStrategy<unknown, T>;
    removeStrategy(strategy: Function): void;
}

export interface ICollectionCommand<T> {
    execute(collection: IBaseCollection<T>): void;
}


export interface ISourceCollection<T> extends IEnumerable<T>, DestroyableMixin, ObservableMixin {
}

export enum ANIMATION_STATE {
    CLOSE = 'close',
    OPEN = 'open',
    NONE = 'none',
    RIGHT_SWIPE = 'right-swipe'
}

export interface ICollection<S, T> extends IBaseCollection<T> {
    getCollection(): ISourceCollection<S>;
    getDisplayProperty(): string;
    getMultiSelectVisibility(): string;
    getRowSpacing(): string;
    getRightSpacing(): string;
    getLeftSpacing(): string;
    getItemUid(item: T): string;
    getMarkerVisibility(): string;
    getSwipeAnimation(): ANIMATION_STATE;
    notifyItemChange(item: T, properties?: object): void;
}
