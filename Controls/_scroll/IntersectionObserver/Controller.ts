import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {SyntheticEvent} from 'Core/vdom/Synchronizer/resources/SyntheticEvent';
import IntersectionObserver = require('Controls/Utils/IntersectionObserver');
import template = require('wml!Controls/_scroll/IntersectionObserver/Controller');
import {descriptor} from "Types/entity";

export interface IIntersectionObserverControllerOptions extends IControlOptions {
   threshold: number[];
}

/**
 * Контейнер позволяющий отслеживать пересечение с внутренними контейнерами.
 *
 * @class Controls/_scroll/IntersectionObserver/Controller
 * @control
 * @author Миронов А.Ю.
 * @see Controls/_scroll/IntersectionObserver/Container
 */

/**
 * @name Controls/_scroll/IntersectionObserver/Controller#threshold
 * @cfg {Array} Число или массив чисел, указывающий, при каком проценте видимости целевого элемента должен
 * сработать callback. Например, в этом случае callback функция будет вызываться при появлении в зоне видимости
 * каждый 25% целевого элемента:  [0, 0.25, 0.5, 0.75, 1]
 */

/**
 * @event Controls/_scroll/IntersectionObserver/Controller#intersect Происходит когда цель достигает порогового значения,
 * указанного в опции threshold
 */

class  ModuleComponent extends Control<IIntersectionObserverControllerOptions> {
   protected _template: TemplateFunction = template;
   protected _observer: IntersectionObserver;
   protected _items: object = {};

   private _registerHandler(event: SyntheticEvent, instId: string, element: HTMLElement, data: object): void {
      this._items[instId] = {
         instId,
         element,
         data
      };
      this._observe(element);
   }

   private _unregisterHandler(event: SyntheticEvent, instId: string): void {
      this._observer.unobserve(this._items[instId].element);
      delete this._items[instId];
   }

   private _observe(element: HTMLElement): void {
      if (!this._observer) {
         this._observer = this._createObserver();
      }
      this._observer.observe(element);
   }

   private _createObserver(): IntersectionObserver {
      return new IntersectionObserver(this._intersectionObserverHandler.bind(this), {
         root: this._container,
         threshold: this._options.threshold
      });
   }

   private _intersectionObserverHandler(entries: IntersectionObserverEntry[]): void {
      const items: object[] = [];
      let itemId;
      for (const entry of entries) {
         itemId = Object.keys(this._items).find((key) => this._items[key].element === entry.target);
         items.push({
            boundingClientRect: entry.boundingClientRect,
            intersectionRatio: entry.intersectionRatio,
            intersectionRect: entry.intersectionRect,
            isIntersecting: entry.isIntersecting,
            isVisible: entry.isVisible,
            rootBounds: entry.rootBounds,
            target: entry.target,
            time: entry.time,
            data: this._items[itemId].data
         });
      }
      this._notify('intersect', [items]);
   }

   protected _beforeUnmount(): void {
      if (this._observer) {
         this._observer.disconnect();
         this._observer = null;
      }
   }

   static getOptionTypes(): object {
        return {
            threshold: descriptor(Array)
        };
    }

    static getDefaultOptions(): object {
        return {
            threshold: [1]
        };
    }
}

export default ModuleComponent;
