/**
 * Created by kraynovdo on 24.05.2018.
 */
/**
 * Created by kraynovdo on 16.11.2017.
 */
define('Controls/List/BaseViewModel',
   ['Core/core-simpleExtend', 'WS.Data/Entity/ObservableMixin', 'WS.Data/Entity/VersionableMixin'],
   function(cExtend, ObservableMixin, VersionableMixin) {

      /**
       *
       * @author Крайнов Дмитрий
       * @public
       */
      var BaseViewModel = cExtend.extend([ObservableMixin, VersionableMixin], {

         constructor: function(cfg) {
            this._options = cfg;
         },

         destroy: function() {
            this._options = null;
         }
      });

      return BaseViewModel;
   });
