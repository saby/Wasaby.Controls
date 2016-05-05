/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.MergeAction', [
    'js!SBIS3.CONTROLS.DialogActionBase',
    'js!SBIS3.CONTROLS.MergeDialogTemplate'
], function(OpenDialogAction) {
    /**
     * Базовый класс для действий объединения.
     * @class SBIS3.CONTROLS.MergeAction
     * @public
     * @extends SBIS3.CONTROLS.OpenDialogAction
     * @author Крайнов Дмитрий Олегович
     */
    var MergeAction = OpenDialogAction.extend( /** @lends SBIS3.CONTROLS.MergeAction.prototype */ {

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
                queryMethodName: undefined,
                /**
                 * @cfg {String} Шаблон отображения ячеек с наименованием объединяемых элементов
                 */
                titleCellTemplate: undefined
            }
        },

        _notifyOnExecuted: function(meta) {
            this._notify('onExecuted', meta)
        },

        setDataSource: function(ds) {
            this._options.dataSource = ds;
        },

       _buildComponentConfig: function(meta) {
          return $ws.core.merge(meta, {
             //Прокидываем необходимые опции в шаблон
             displayField: this._options.displayField,
             queryMethodName: this._options.queryMethodName,
             hierField: this._options.hierField,
             dataSource: this._options.dataSource,
             keyField: this._options.dataSource.getIdProperty(),
             testMergeMethodName: this._options.testMergeMethodName,
             titleCellTemplate: this._options.titleCellTemplate
          });
       }
    });

    return MergeAction;

});