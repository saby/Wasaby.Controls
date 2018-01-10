/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('SBIS3.CONTROLS/OperationsPanel/Merge', [
    'SBIS3.CONTROLS/Link',
   'i18n!SBIS3.CONTROLS/OperationsPanel/Merge'
], function(Link) {
    /**
     * Операция панели действий, которая предназначена для объединения записей.
     * Пример использования операции вы можете найти в разделе <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/records-editing/items-action/panel/basic-operations/merge/">Операция объединения записей реестра</a>.
     * @class SBIS3.CONTROLS/OperationsPanel/Merge
     * @extends SBIS3.CONTROLS/Link
     * @author Сухоручкин А.С.
     * @public
     */
    var OperationMerge = Link.extend(/** @lends SBIS3.CONTROLS/OperationsPanel/Merge.prototype */{

        $protected: {
            _options: {
                /**
                 * @noShow
                 */
                linkedView: undefined,
                /**
                 * @cfg {String} Устанавливает иконку кнопки объединения.
                 * @remark
                 * Список иконок вы можете найти в разделе {@link /docs/3-8-0/icons/ Иконки}.
                 * @editor icon ImageEditor
                 */
                icon: 'sprite:icon-24 icon-Unite icon-primary',
                caption: rk('Объединить')
            }
        },

        $constructor: function() {
        },
        _clickHandler: function() {
            //TODO: при переходе на новую идеалогию ПМО linkedView не понадобится
            this.sendCommand('mergeItems', this._options.linkedView.getSelectedKeys());
        }
    });

    return OperationMerge;

});