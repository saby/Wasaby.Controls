define('js!SBIS3.CONTROLS.TreePaging', [
   "js!SBIS3.CORE.Control",
   "tmpl!SBIS3.CONTROLS.TreePaging"
], function(Control, tmplFn) {
   var TreePaging = Control.Control.extend({
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
         this._container.toggleClass('ws-hidden', !this._options.hasMore);
      }
   });

   return TreePaging;
});