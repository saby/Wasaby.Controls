/**
 * Created by kraynovdo on 13.11.2017.
 */
define('js!Controls/List/Controllers/ScrollPaging',
   [
      'Core/Abstract'
   ],
   function(Abstract) {
      /**
       *
       * @author Крайнов Дмитрий
       * @public
       */
      var Paging = Abstract.extend({
         _selectedPage: null,

         constructor: function(cfg) {
            Paging.superclass.constructor.apply(this, arguments);
            if (cfg.selectedPage) {
               this._selectedPage = cfg.selectedPage;
            }
         },

         getPagingCfg: function(recordset) {

         }
      });

      return Paging;
   });
