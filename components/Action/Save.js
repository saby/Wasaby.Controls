define('SBIS3.CONTROLS/Action/Save', [
    'SBIS3.CONTROLS/Action',
    'Core/core-instance',
    'Core/moduleStubs',
    'Core/Deferred'
], function (Action, cInstance, moduleStubs, Deferred) {

    /**
     * Базовый класс действия для сохранения данных.
     * @class SBIS3.CONTROLS/Action/Save
     * @public
     * @extends SBIS3.CONTROLS/Action
     * @author Сухоручкин А.С.
     */
    var Save = Action.extend(/** @lends SBIS3.CONTROLS/Action/Save.prototype */{
        $protected: {
            _options: {
               /**
                * @cfg {SBIS3.CONTROLS/Action/Save/SaveStrategy/ISaveStrategy) Стратегия сохранения. Класс, который реализует сохранение записей.
                * @see SBIS3.CONTROLS/Action/Save/SaveStrategy/ISaveStrategy
                * @see SBIS3.CONTROLS/Action/Save/SaveStrategy/Base
                * @see SBIS3.CONTROLS/Action/Save/SaveStrategy/Sbis
                */
                saveStrategy: 'SBIS3.CONTROLS/Action/Save/SaveStrategy/Base'
            },
            _saveStrategy: undefined
        },
        /**
         * @name SBIS3.CONTROLS/Action/Save#execute
         * @function
         * @description
         * Запускает выполнение действия.
         * @remark
         * Действие может быть выполнено, когда это не запрещено в опции {@link _canExecute}.
         * Перед выполнением происходит событие {@link onExecute}, после выполнения - {@link onExecuted}, а в случае ошибки - {@link onError}.
         * @param {Object} meta Метаданные.
         * @param {Array} [meta.columns] Колонки, которые будут сохраняться.
         * @param {String} [meta.xsl] Имя файла с xsl преобразованием.
         * @param {String} [meta.endpoint] Имя объекта бизнес-логики, который осуществляет сохранение данных.
         * Если параметр не указан, данные выведутся на печать.
         * @param {String} [meta.fileName] Имя сохраняемого файла.
         * @param {Boolean} [meta.isExcel] Файл сохраняется в формате EXCEL.
         * @param {Number} [meta.pageOrientation] Ориентация страниц при сохранении в PDF формат.
         * @param {WS.Data/Collection/RecordSet} [meta.recordSet] Набор данных, который будет сохранён.
         * @param {WS.Data/Query/Query} [meta.query] Запрос, по которому будут получены данные для сохранения.
         */
        /**
         * Сохраняет елементы.
         * @private
         */
        _doExecute: function(meta) {
           this.getSaveStrategy().addCallback(function(strategy) {
              strategy.saveAs(meta);
              return strategy;
           });
        },

        /**
         * Возвращает стратегию сохранения
         * @returns {SBIS3.CONTROLS/Action/Save/SaveStrategy/ISaveStrategy} strategy - стратегия сохранения
         */
        getSaveStrategy: function () {
            return this._saveStrategy || (this._saveStrategy = this._makeSaveStrategy());
        },

        /**
         * Устанавливает стратегию сохранения
         * @param {SBIS3.CONTROLS/Action/Save/SaveStrategy/ISaveStrategy} strategy - стратегия сохранения
         */
        setSaveStrategy: function (strategy) {
            if(!cInstance.instanceOfMixin(strategy, 'SBIS3.CONTROLS/Action/Save/SaveStrategy/ISaveStrategy')){
                throw new Error('The strategy must implemented interfaces the SBIS3.CONTROLS.ISaveStrategy.')
            }
            this._saveStrategy = Deferred.success(strategy);
        },

        /**
         * Создает стратегию сохранения
         * @private
         */
        _makeSaveStrategy: function () {
            return moduleStubs.require([this._options.saveStrategy]).addCallback(function(result) {
                return new result[0]();
            });
        }

    });

    return Save;

});