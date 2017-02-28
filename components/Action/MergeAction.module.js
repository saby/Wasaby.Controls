/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.MergeAction', [
   "Core/core-merge",
   "js!SBIS3.CONTROLS.Action.OpenDialog",
   "Core/IoC",
   "js!SBIS3.CONTROLS.MergeDialogTemplate"
], function (cMerge, OpenDialogAction, IoC) {
   /**
    * Действие открытия окна, в котором производится выбор записей для их объединения.
    * Пример использования класса можно найти в разделе {@link http://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/items-action/panel/basic-operations/merge/ Операция объединения записей реестра}.
    * @class SBIS3.CONTROLS.MergeAction
    * @public
    * @extends SBIS3.CONTROLS.DialogActionBase
    * @author Сухоручкин Андрей Сергеевич
    */
   var MergeAction = OpenDialogAction.extend(/** @lends SBIS3.CONTROLS.MergeAction.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {String} Устанавливает компонент, который будет использован для построения окна объединения записей.
             * @see mode
             * @see titleCellTemplate
             */
            dialogComponent: 'js!SBIS3.CONTROLS.MergeDialogTemplate',
            /**
             * @cfg {String} Устанавливаем режим открытия компонента объединения записей.
             * @variant dialog Компонент открывается в новом диалогом окне.
             * @variant floatArea Компонент открывается на всплывающей панели.
             * @see dialogComponent
             */
            mode: 'dialog',
            /**
             * @cfg {String} Устанавливает поле отображения.
             * @remark
             * Опция актуальна для использования, когда источник данных имеет иерархическую структуру.
             * @see parentProperty
             */
            displayProperty: undefined,
            /**
             * @cfg {String} Устанавливает поле иерархии данных.
             * @remark
             * Опция актуальная для использования, когда источник данных имеет иерархическую структуру.
             * @see displayProperty
             */
            parentProperty: undefined,
            /**
             * @cfg {String} Устанавливает поле в котором хранится признак типа записи в иерархии
             * @remark
             * null - лист, false - скрытый узел, true - узел
             *
             * @example
             * <pre>
             *    <option name="nodeProperty">Раздел@</option>
             * </pre>
             */
            nodeProperty: null,

            /**
             * @cfg {DataSource|WS.Data/Source/ISource|Function} Устанавливает источник данных.
             * @see setDataSource
             *
             */
            dataSource: undefined,
            /**
             * @cfg {String} Устанавливает имя метода бизнес-логики, который будет использован для проверки возможности объединения записей.
             * @remark
             * Методу передаются параметры в следующем порядке:
             * <ol>
             *   <li>target {String}: ключ целевой записи.</li>
             *   <li>merged {Array.<string>}: массив ключей сливаемых записей.</li>
             * </ol>
             * Метод возвращает recordSet, который содержит следующие поля:
             * <ul>
             *   <li>{String} поле, которое является keyField в источнике данных;</li>
             *   <li>{String} поле, которое является displayProperty в источнике данных;</li>
             *   <li>поля иерархии;</li>
             *   <li>{String} поле 'Comment', в котором находится резюме операции;</li>
             *   <li>{Boolean} поле 'Available', которое содержит признак возможности объединения данной записи.<li>
             * </ul>
             * @see queryMethodName
             */
            testMergeMethodName: undefined,
            /**
             * @cfg {String} Устанавливает имя списочного метода, который будет использован для получения записей от источника.
             * @remark
             * Набор полученных записей будет отображен на диалоге объединения.
             * @see testMergeMethodName
             */
            queryMethodName: undefined,
            /**
             * @cfg {String} Устанавливает шаблон отображения ячеек с наименованием объединяемых записей.
             * @remark
             * Шаблон - это XHTML-файл, который создают в директории компонента в подпапке resources.
             * @see dialogComponent
             */
            titleCellTemplate: undefined
         }
      },

      _modifyOptions: function (cfg) {
         if (cfg.hierField) {
            IoC.resolve('ILogger').log('MergeAction', 'Опция hierField является устаревшей, используйте parentProperty');
            cfg.parentProperty = cfg.hierField;
         }
         if (cfg.parentProperty && !cfg.nodeProperty) {
            cfg.nodeProperty = cfg.parentProperty + '@';
         }
         if (cfg.displayField) {
            IoC.resolve('ILogger').log('MergeAction', 'Опция displayField является устаревшей, используйте displayProperty');
            cfg.displayProperty = cfg.displayField;
         }
         if (cfg.keyField) {
            IoC.resolve('ILogger').log('MergeAction', 'Опция keyField является устаревшей, используйте idProperty');
            cfg.idProperty = cfg.keyField;
         }
         return MergeAction.superclass._modifyOptions.apply(this, arguments);
      },

      _notifyOnExecuted: function (meta, result) {
         this._notify('onExecuted', result)
      },
      /**
       * Устанавливает источник данных для окна объединения записей.
       * @param {DataSource|WS.Data/Source/ISource|Function} ds Источник данных.
       * @see dataSource
       */
      setDataSource: function (ds) {
         this._options.dataSource = ds;
      },
      _buildComponentConfig: function (meta) {
         return cMerge(meta, {
            //Прокидываем необходимые опции в шаблон
            displayField: this._options.displayField,
            displayProperty: this._options.displayProperty,
            queryMethodName: this._options.queryMethodName,
            hierField: this._options.parentProperty,
            parentProperty: this._options.parentProperty,
            nodeProperty: this._options.nodeProperty,
            dataSource: this._options.dataSource,
            keyField: this._options.dataSource.getIdProperty(),
            idProperty: this._options.dataSource.getIdProperty(),
            testMergeMethodName: this._options.testMergeMethodName,
            titleCellTemplate: this._options.titleCellTemplate
         });
      }
   });

   return MergeAction;

});