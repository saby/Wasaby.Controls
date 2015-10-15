define('js!SBIS3.CONTROLS.Registry', [
   'js!SBIS3.CONTROLS.RegistryBase',
   'html!SBIS3.CONTROLS.Registry',
   'js!SBIS3.CONTROLS.SearchForm',
   'js!SBIS3.CONTROLS.BreadCrumbs',
   'js!SBIS3.CONTROLS.BackButton',
   'js!SBIS3.CONTROLS.OperationsPanel',
   'js!SBIS3.CONTROLS.FilterButton'
], function(RegistryBase, dotTplFn, ComponentBinder){
   'use strict';

   /**
    * Базовый класс для реестра
    *
    * @class SBIS3.CONTROLS.Registry
    * @extends SBIS3.CONTROLS.RegistryBase
    * @public
    */



   var Registry = RegistryBase.extend( /** @lends SBIS3.CONTROLS.RegistryBase.prototype */{
      _dotTplFn : dotTplFn,
      $protected: {
         _options : {
            /**
            * @cfg {String} Опции для поля поиска в виде XML разметки
            */
            searchConfig : '',
            /**
             * @cfg {String} Опции для панели операция в виде XML разметки
             */
            operationsPanelConfig : '',
            /**
             * @cfg {String} Опции для панели операция в виде XML разметки
             */
            backButtonConfig : '',
            /**
             * @cfg {String} Опции для панели операция в виде XML разметки
             */
            breadCrumbsConfig : '',
            /**
             * @cfg {String} Опции для панели операция в виде XML разметки
             */
            filterButtonConfig : ''
         }
      },

      $constructor: function () {

      }
   });

   return Registry;
});