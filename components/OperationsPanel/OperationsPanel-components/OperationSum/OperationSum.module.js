/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationSum', [
    'js!SBIS3.CONTROLS.IconButton'
], function(IconButton) {
    /**
     * Операция суммирования.
     *
     * SBIS3.CONTROLS.OperationSum
     * @class SBIS3.CONTROLS.OperationSum
     * @extends SBIS3.CONTROLS.IconButton
     * @control
     * @public
     * @author Крайнов Дмитрий Олегович
     * @initial
     * <component data-component='SBIS3.CONTROLS.OperationSum'>
     *
     * </component>
     */
    var OperationSum = IconButton.extend(/** @lends SBIS3.CONTROLS.OperationSum.prototype */{

        $protected: {
            _options: {
                /**
                 * @noShow
                 */
                linkedView: undefined,
                /**
                 * @cfg {String} Иконка кнопки суммирования
                 * @editor icon ImageEditor
                 */
                icon: 'sprite:icon-24 icon-Sum icon-primary action-hover',
                command: 'sumItems',
                caption: rk('Суммировать')
            }
        }
    });

    return OperationSum;

});