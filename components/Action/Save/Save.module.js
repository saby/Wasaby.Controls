define('js!SBIS3.CONTROLS.Action.Save', [
    'js!SBIS3.CONTROLS.Action.Action',
    'Core/core-instance',
    'js!WS.Data/Di'
], function (Action, cInstance, Di) {

    /**
     * Базовый экшен для сохранения данных.
     * @class SBIS3.CONTROLS.Action.Save
     * @public
     * @extends SBIS3.CONTROLS.Action.Action
     * @author Сухоручкин Андрей Сергеевич
     */
    var Save = Action.extend(/** @lends SBIS3.CONTROLS.Action.Save.prototype */{
        $protected: {
            _options: {
                saveStrategy: 'savestrategy.sbis'
            },
            _saveStrategy: undefined
        },

        /**
         * Сохраняет елементы.
         * @private
         */
        _doExecute: function(meta) {
            this.getSaveStrategy().saveAs(meta);
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
            this._saveStrategy = strategy;
        },

        /**
         * Создает стратегию сохранения
         * @private
         */
        _makeSaveStrategy: function () {
            return Di.resolve(this._options.saveStrategy);
        }

    });

    return Save;

});