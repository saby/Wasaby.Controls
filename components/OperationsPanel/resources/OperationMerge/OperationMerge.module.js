/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationMerge', [
    'js!SBIS3.CONTROLS.Link'
], function(Link) {
    /**
     * Операция объединения.
     *
     * SBIS3.CONTROLS.OperationMerge
     * @class SBIS3.CONTROLS.OperationMerge
     * @extends SBIS3.CONTROLS.Link
     * @control
     * @public
     * @author Крайнов Дмитрий Олегович
     * @initial
     * <component data-component='SBIS3.CONTROLS.OperationMerge'>
     *
     * </component>
     */
    var OperationMerge = Link.extend({

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
                caption: 'Объединить'
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