import DataContext = require('Core/DataContext');

/**
 * Контекст для {@link Controls/scroll:Container}.
 * Используется для управления видимостью кнопок постраничной навигации.
 *
 * @example
 * Пример настройки постраничной навигации, когда кнопки не отображаются для внутреннего скролл-контейнера.
 *
 * <pre class="brush: html">
 * class MyControl extends Control<IControlOptions> {
 *    _beforeMount(options, context, receivedState) {
 *       this._scrollDataContext = new DataContext({
 *          pagingVisible: false
 *       });
 *    }
 * }
 * </pre>
 *
 * @class Controls/_scroll/Context
 * @extends Core/DataContext
 * @demo Controls-demo/Scroll/Context/Index
 *
 * @private
 * @author Красильников А.С.
 *
 */

/*
 * Context for {@link Controls/_scroll/Container}.
 * Used to control the visibility of paginated navigation.
 *
 * @example
 * Example setting paginated navigation is't visible for internal scroll container.
 *
 * <pre>
 *    class MyControl extends Control<IControlOptions> {
 *       _beforeMount: function(options, context, receivedState) {
 *          this._scrollDataContext = new DataContext({
 *              pagingVisible: false
 *          });
 *       }
 *    }
 * </pre>
 *
 * @class Controls/_scroll/Scroll/Context
 * @extends Core/DataContext
 *
 * @private
 * @author Красильников А.С.
 *
 */
class ScrollContext extends DataContext {
   _moduleName: string;
   pagingVisible: boolean;

   constructor(cfg: { pagingVisible: boolean }) {
      super();
      this.pagingVisible = cfg.pagingVisible;
   }

   setPagingVisible(pagingVisible: boolean) {
      this.pagingVisible = pagingVisible;
      // Core/DataContext написан на js, в итоге с него не цепляются типы
      // tslint:disable-next-line:ban-ts-ignore
      // @ts-ignore
      this.updateConsumers();
   }
}

ScrollContext.prototype._moduleName = 'Controls/_scroll/Scroll/Context';

export default ScrollContext;
