/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.MergeAction', [
    'js!SBIS3.CONTROLS.OpenDialogAction',
    'js!SBIS3.CONTROLS.MergeDialogTemplate'
], function(OpenDialogAction) {
    var MergeAction = OpenDialogAction.extend({

        $protected: {
            _options: {
                dialogComponent : 'js!SBIS3.CONTROLS.MergeDialogTemplate',
                mode: 'dialog',
                /**
                 * @cfg {String} Cерверный метод для проверки объединения
                 * @see SBIS3.CONTROLS.DSMixin#displayField
                 */
                displayField: undefined,
                /**
                 * @cfg {String} Поле иерархии
                 * @see SBIS3.CONTROLS.hierarchyMixin#hierField
                 */
                hierField: undefined,
                /**
                 * @cfg {DataSource} Набор исходных данных, по которому строится отображение
                 * @see SBIS3.CONTROLS.DSMixin#dataSource
                 */
                dataSource: undefined,
                /**
                 * @cfg {String} Cерверный метод для проверки объединения
                 * На вход данному методу приходит:
                 * 1) target{String}: ключ целевой записи
                 * 2) merged{Array.<string>}: массив ключей сливаемых записей
                 * На выход данный метод должен отдать recordSet содержащий:
                 * 1) {String} поле являющиеся keyField в источнике данных
                 * 2) {String} поле являющиеся displayField в источнике данных
                 * 3) поля иерархии
                 * 4) {String} поле 'Comment' в котором находится резюме операции
                 * 5) {Boolean} поле 'Available' в котором находится возможность объединения данной записи
                 */
                testMergeMethodName: undefined,
                /**
                 * @cfg {String} Имя списочного метода, который будет вызван для получения записей,
                 * отображаемых в диалоге объединения
                 */
                queryMethodName: undefined
            }
        },
        /**
         * Метод запускающий выполнение MergeAction
         * @param {Object} [meta]
         * @param {Array} [meta.items] Массив ключей, объединяемых записей.
         * @param {String} [meta.selectedKey] Ключ записи, которая будет выбрана по умолчанию.
         */
        execute : function(meta) {
            this._opendEditComponent($ws.core.merge(meta, {
                //Прокидываем необходимые опции в шаблон
                displayField: this._options.displayField,
                queryMethodName: this._options.queryMethodName,
                hierField: this._options.hierField,
                dataSource: this._options.dataSource,
                testMergeMethodName: this._options.testMergeMethodName
            }), this._options.dialogComponent);
        },

        _notifyOnExecuted: function(meta) {
            this._notify('onExecuted', meta)
        },

        setDataSource: function(ds) {
            this._options.dataSource = ds;
        }
    });

    return MergeAction;

});