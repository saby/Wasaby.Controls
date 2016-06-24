/* global define, $ws*/
define('js!SBIS3.CONTROLS.Data.MoveStrategy.Sbis', [
   'js!SBIS3.CONTROLS.Data.MoveStrategy.Base',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic'
], function (BaseMoveStrategy, DI, Utils) {
   'use strict';
   /**
    * Стандартная стратегия перемещения записей
    * @class SBIS3.CONTROLS.Data.MoveStrategy.Sbis
    * @extends SBIS3.CONTROLS.Data.MoveStrategy.Base
    * @public
    * @author Ганшин Ярослав
    * @example
    */

   var SbisMoveStrategy = BaseMoveStrategy.extend([],/** @lends SBIS3.CONTROLS.Data.MoveStrategy.Sbis.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.MoveStrategy.Sbis',
      $protected: {
         _options:{

            /**
             * @cfg {String} Имя объекта бизнес-логики, реализующего перемещение записей. По умолчанию 'ПорядковыйНомер'.
             * @example
             * <pre>
             *    <option name="moveContract">ПорядковыйНомер</option>
             * </pre>
             * @see move
             */
            moveContract: 'ПорядковыйНомер',

            /**
             * @cfg {String} Префикс имени метода, который используется для перемещения записи. По умолчанию 'Вставить'.
             * @see move
             */
            moveMethodPrefix: 'Вставить',

            /**
             * @cfg {String} Имя поля, по которому по умолчанию сортируются записи выборки. По умолчанию 'ПорНомер'.
             * @see move
             */
            moveDefaultColumn: 'ПорНомер',

            /**
             * @cfg {List} .
             */
            listView: undefined

         },

         _orderProvider: undefined
      },
      $constructor: function (cfg){
         cfg = cfg || {};

         //Deprecated
         if ('moveResource' in cfg && !('moveContract' in cfg)) {
            Utils.logger.stack(this._moduleName + '::$constructor(): option "moveResource" is deprecated and will be removed in 3.7.4. Use "moveContract" instead.', 1);
            this._options.moveContract = cfg.moveResource;
         }

         if (!this._options.contract) {
            this._options.contract = this._options.dataSource.getEndpoint().contract;
         }
      }


   });

   return SbisMoveStrategy;
});
