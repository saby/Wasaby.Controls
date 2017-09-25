define('js!SBIS3.CONTROLS.TreePaging', [
   "js!SBIS3.CORE.CompoundControl",
   "tmpl!SBIS3.CONTROLS.TreePaging",
   'i18n!SBIS3.CONTROLS.TreePaging'
], function(CompoundControl, tmplFn) {
    /**
     *
     * @class SBIS3.CONTROLS.TreePaging
     * @extends SBIS3.CORE.CompoundControl
     *
     * @author Сухоручкин Андрей Сергеевич
     *
     * @public
     */
   var TreePaging = CompoundControl.extend(/** @lends SBIS3.CONTROLS.TreePaging.prototype*/{
      _dotTplFn: tmplFn,
      $protected :{
         _options : {
            id: null,
            pageSize : 20,
            hasMore : false
         }
      },
      setHasMore: function(more) {
         this._options.hasMore = !!more;
         this._container.toggleClass('ws-hidden', !(this._options.pageSize && more));
      }
   });

   return TreePaging;
});