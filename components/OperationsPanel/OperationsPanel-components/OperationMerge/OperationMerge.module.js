/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationMerge', [
    'js!SBIS3.CONTROLS.Link',
   'i18n!SBIS3.CONTROLS.OperationMerge'
], function(Link) {
    /**
     * Операция панели действий, которая предназначена для объединения записей.
     * Пример использования операции вы можете найти в разделе {@link http://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/records-editing/items-action/panel/basic-operations/merge/ Операция объединения записей реестра}.
     * @class SBIS3.CONTROLS.OperationMerge
     * @extends SBIS3.CONTROLS.Link
     * @author Сухоручкин Андрей Сергеевич
     * @public
     */
    var OperationMerge = Link.extend(/** @lends SBIS3.CONTROLS.OperationMerge.prototype */{

        $protected: {
            _options: {
                /**
                 * @noShow
                 */
                linkedView: undefined,
                /**
                 * @cfg {String} Устанавливает иконку кнопки объединения.
                 * @remark
                 * Список иконок вы можете найти в разделе {@link https://wi.sbis.ru/docs/3-8-0/icons/ Иконки}.
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