import IItemsStrategy from './IItemsStrategy';
import {ANIMATION_STATE} from "./interface/ICollection";

export type TItemKey = string | number;

export interface IBaseCollection<T> {
    each(cb: (item: T) => void): void;
    getItemBySourceKey(key: TItemKey): T;
    find(predicate: (item: T) => boolean): T;
    nextVersion(): void;
    setEventRaising(enabled: boolean, analyze?: boolean): void;
    getCount?(): number;
    getNext?(item: T): T;
    getPrevious?(item: T): T;

    /**
     * Установить в модель текущее состояние анимации
     * @param {Controls/display:ANIMATION_STATE} state Текущее состояние анимации
     * @method
     * @public
     */
    setSwipeAnimation?(state: ANIMATION_STATE): void;

    /**
     * Получить текущее состояние анимации
     * @method
     * @public
     * @return {Controls/display:ANIMATION_STATE} Текущее состояние анимации
     */
    getSwipeAnimation?(): ANIMATION_STATE;
}

export interface IStrategyCollection<T> {
    appendStrategy(strategy: Function, options?: object): void;
    getStrategyInstance(strategy: Function): IItemsStrategy<unknown, T>;
    removeStrategy(strategy: Function): void;
}
