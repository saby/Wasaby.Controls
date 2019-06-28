import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_scroll/IntersectionObserver/Container');

export interface IIntersectionObserverContainerOptions extends IControlOptions {
   data: object;
}

/**
 * Контейнер позволяющий отслеживать пересечение с внешним контенером.
 *
 * @class Controls/_scroll/IntersectionObserver/Container
 * @control
 * @author Миронов А.Ю.
 * @see Controls/_scroll/IntersectionObserver
 */

/**
 * @name Controls/_scroll/IntersectionObserver/Container#data
 * @cfg {Object} Данные которые приходят в событие {@link Controls/_scroll/IntersectionObserver/Controller#intersect}
 * в качестве параметра.
 */

class  ModuleComponent extends Control<IIntersectionObserverContainerOptions> {
   protected _template: TemplateFunction = template;

   protected _afterMount(): void {
      this._notify(
          'intersectionObserverRegister',
          [this.getInstanceId(), this._container, this._options.data],
          { bubbling: true });
   }

   protected _beforeUnmount(): void {
      this._notify('intersectionObserverUnregister', [this.getInstanceId()], { bubbling: true });
   }
}

export default ModuleComponent;
