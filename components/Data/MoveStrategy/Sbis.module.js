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
             * @deprecated используйте ednpoint.moveContract на источнике данных
             * @cfg {String} Имя объекта бизнес-логики, реализующего перемещение записей. По умолчанию 'ПорядковыйНомер'.
             * @example
             * <pre>
             *    <option name="moveContract">ПорядковыйНомер</option>
             * </pre>
             * @see #SBIS3.CONTROLS.Data.Source.SbisService.ednpoint
             */
            moveContract: 'ПорядковыйНомер',

            /**
             * @deprecated используйте binding.moveAfter, binding.moveBefore на источнике данных
             * @cfg {String} Префикс имени метода, который используется для перемещения записи. По умолчанию 'Вставить'.
             * @see #SBIS3.CONTROLS.Data.Source.SbisService.binding
             */
            moveMethodPrefix: 'Вставить',

            /**
             * @deprecated
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
      $constructor: function (cfg) {
         cfg = cfg || {};

         if (!('dataSource' in cfg) && !('listView' in cfg)) {
            this._options.dataSource = DI.resolve('source.sbis-service',{});
            this._options.dataSource.setMoveMethods(this._options.moveMethodPrefix);
         } else if (('listView' in cfg) && !this._options.dataSource) {
            this._options.dataSource = cfg.listView.getDataSource();
         }

         //Deprecated
         if ('moveContract' in cfg) {
            Utils.logger.stack(this._moduleName + '::$constructor(): option "moveContract" is deprecated and will be removed in 3.8.0. Use "moveContract" on the DataSource', 1);
            this._options.dataSource.setMoveContract(this._options.moveContract);
         }

         if ('moveMethodPrefix' in cfg) {
            Utils.logger.stack(this._moduleName + '::$constructor(): option "moveMethodPrefix" is deprecated and will be removed in 3.8.0. Use "binding.moveAfter" and "binding.moveBefore" on the DataSource', 1);
            this._options.dataSource.setMoveMethods(this._options.moveMethodPrefix);
         }



      }


   });

   return SbisMoveStrategy;
});
