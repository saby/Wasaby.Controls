/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationMerge', [
    'js!SBIS3.CONTROLS.Link',
   'i18n!SBIS3.CONTROLS.OperationMerge'
], function(Link, rk) {
    /**
     * Операция панели действий, которая предназначена для объединения записей.
     * Пример использования операции вы можете найти в разделе {@link http://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/items-action/panel/basic-operations/merge/ Операция объединения записей реестра}.
     * @class SBIS3.CONTROLS.OperationMerge
     * @extends SBIS3.CONTROLS.Link
     * @control
     * @public
     * @author Сухоручкин Андрей Сергеевич
     * @initial
     * <component data-component='SBIS3.CONTROLS.OperationMerge'>
     *
     * </component>
     */
    var OperationMerge = Link.extend(/** @lends SBIS3.CONTROLS.OperationMerge.prototype */{

        $protected: {
            _options: {
                /**
                 * @noShow
                 */
                linkedView: undefined,
                /**
                 * @cfg {String} Иконка кнопки объединения
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