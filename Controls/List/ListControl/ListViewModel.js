/**
 * Created by kraynovdo on 16.11.2017.
 */
define('js!Controls/List/ListControl/ListViewModel',
   ['Core/Abstract'],
   function(Abstract) {
      /**
       *
       * @author Крайнов Дмитрий
       * @public
       */
      var ListViewModel = Abstract.extend({

         constructor: function(cfg) {
            this._options = cfg;
            ListViewModel.superclass.constructor.apply(this, arguments);

         }
      });

      return ListViewModel;
   });
