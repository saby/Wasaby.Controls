/**
 * Created by kraynovdo on 24.05.2018.
 */
/**
 * Created by kraynovdo on 16.11.2017.
 */
define('Controls/List/BaseViewModel',
   ['Core/core-simpleExtend', 'Types/entity'],
   function(cExtend, entity) {

      /**
       *
       * @author Авраменко А.С.
       * @public
       */
      var BaseViewModel = cExtend.extend([entity.ObservableMixin.prototype, entity.VersionableMixin], {

         constructor: function(cfg) {
            this._options = cfg;
         },

         destroy: function() {
            entity.ObservableMixin.prototype.destroy.apply(this, arguments);
            this._options = null;
         }
      });

      return BaseViewModel;
   });
