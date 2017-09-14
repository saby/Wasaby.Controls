define('js!SBIS3.CONTROLS.Action.Save', [
    'js!SBIS3.CONTROLS.Action.Action',
    'Core/core-instance',
    'Core/moduleStubs',
    'Core/Deferred'
], function (Action, cInstance, moduleStubs, Deferred) {

    /**
     * Базовый action для сохранения данных.
     * @class SBIS3.CONTROLS.Action.Save
     * @public
     * @extends SBIS3.CONTROLS.Action.Action
     * @author Сухоручкин Андрей Сергеевич
     */
    var Save = Action.extend(/** @lends SBIS3.CONTROLS.Action.Save.prototype */{
        $protected: {
            _options: {
               /**
                * @cfg {SBIS3.CONTROLS.ISaveStrategy) Стратегия сохранения. Класс, который реализует сохранение записей.
                * @see {@link SBIS3.CONTROLS.ISaveStrategy}
                * @see {@link SBIS3.CONTROLS.SaveStrategy.Base}
                * @see {@link SBIS3.CONTROLS.SaveStrategy.Sbis}
                */
                saveStrategy: 'js!SBIS3.CONTROLS.SaveStrategy.Base'
            },
            _saveStrategy: undefined
        },

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
         * @returns {SBIS3.CONTROLS.ISaveStrategy} strategy - стратегия сохранения
         */
        getSaveStrategy: function () {
            return this._saveStrategy || (this._saveStrategy = this._makeSaveStrategy());
        },

        /**
         * Устанавливает стратегию сохранения
         * @param {SBIS3.CONTROLS.ISaveStrategy} strategy - стратегия сохранения
         */
        setSaveStrategy: function (strategy) {
            if(!cInstance.instanceOfMixin(strategy, 'SBIS3.CONTROLS.ISaveStrategy')){
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