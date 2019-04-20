/**
 * Context for {@link Controls/_scroll/Scroll}.
 * Used to control the visibility of paginated navigation.
 *
 * @example
 * Example setting paginated navigation is't visible for internal scroll container.
 *
 * <pre>
 *    Component = Control.extend({
 *       _stickyHeaderContext: null,
 *       _beforeMount: function(options, context, receivedState) {
 *          this._scrollDataContext = new DataContext({
 *              pagingVisible: false
 *          });
 *       }
 *       _getChildContext: function() {
 *          return {
 *             stickyHeader: this._scrollDataContext
 *          };
 *       },
 *    })
 * </pre>
 *
 * @class Controls/_scroll/Scroll/Context
 * @extends Core/DataContext
 * @control
 * @public
 * @author Mironov A.U.
 * @category Container
 *
 */
import DataContext = require('Core/DataContext');
      export = DataContext.extend({
         _moduleName: 'Controls/_scroll/Scroll/Context',
         constructor: function(cfg) {
            this.pagingVisible = cfg.pagingVisible;
         }
      });

