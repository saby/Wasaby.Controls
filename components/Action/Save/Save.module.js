define('js!SBIS3.CONTROLS.Action.Save', [
    'js!SBIS3.CONTROLS.Action.Action',
    'js!SBIS3.CONTROLS.SaveStrategy.Base',
    'Core/core-instance'
], function (Action, SaveStrategyBase, cInstance) {

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
                saveStrategy: undefined
            },
            _saveStrategy: undefined
        },

        /**
         * Сохраняет елементы.
         * @private
         */
        _save: function(meta) {
            this.getSaveStrategy().saveAs(meta);
        },

        /**
         * Возвращает стратегию сохранения
         */
        getSaveStrategy: function () {
            if (!this._saveStrategy) {
                this._makeSaveStrategy();
            }
            return this._saveStrategy;
        },

        /**
         * Устанавливает стратегию сохранения
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
            this._saveStrategy = new SaveStrategyBase();
        }

    });

    return Save;

});