/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('SBIS3.CONTROLS/OperationsPanel/Sum', [
    'SBIS3.CONTROLS/Link'
], function(Link) {
    /**
     * Операция суммирования.
     *
     * SBIS3.CONTROLS/OperationsPanel/Sum
     * @class SBIS3.CONTROLS/OperationsPanel/Sum
     * @extends SBIS3.CONTROLS/Link
     * @control
     * @public
     * @author Сухоручкин А.С.
     * @initial
     * <component data-component='SBIS3.CONTROLS/OperationsPanel/Sum'>
     *
     * </component>
     */
    var OperationSum = Link.extend(/** @lends SBIS3.CONTROLS/OperationsPanel/Sum.prototype */{

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
                title: rk('Суммировать'),
                allowChangeEnable: false
            }
        }
    });

    return OperationSum;

});