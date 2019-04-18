define('Controls/Container/Scroll/Context',
   [
      'Core/DataContext'
   ],
   function(DataContext) {
      /**
       * Context for {@link Controls/Container/Scroll}.
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
       * @class Controls/Container/Scroll/Context
       * @extends Core/DataContext
       * @control
       * @public
       * @author Mironov A.U.
       * @category Container
       *
       */
      return DataContext.extend({
         constructor: function(cfg) {
            this.pagingVisible = cfg.pagingVisible;
         }
      });
   }
);
