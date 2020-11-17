import Base from './Base';
import Notification from '../Opener/Notification';
import {INotificationPopupOptions} from '../interface/INotification';

/**
 * Хелпер для открытия нотификационных окон
 * @class Controls/_popup/PopupHelper/Notification
 * 
 * @author Красильников А.С.
 * @public
 */
export default class NotificationOpener extends Base {
    _opener = Notification;

    /**
     * Метод для открытия нотификационных окон
     * @function Controls/_popup/PopupHelper/Notification#open
     * @param {INotificationPopupOptions} popupOptions Конфигурация нотификационного окна
     * @example
     * <pre class="brush: js">
     * import {NotificationOpener} from 'Controls/popup';
     * ...
     * this._notification = new NotificationOpener();
     * openNotification() {
     *     this._notification.open({
     *         template: 'Example/MyNotificationTemplate',
     *         opener: this
     *     });
     * }
     * </pre>
     * @see close
     * @see destroy
     */
    open(popupOptions: INotificationPopupOptions) {
        super.open(popupOptions);
    }
}
/**
 * Метод для закрытия нотификационного окна
 * @name Controls/_popup/PopupHelper/Notification#close
 * @function
 * @example
 * <pre class="brush: js">
 * import {NotificationOpener} from 'Controls/popup';
 * ...
 * this._notification = new NotificationOpener();
 *
 * closeNotification() {
 *    this._notification.close();
 * }
 * </pre>
 * @see open
 * @see destroy
 */

/**
 * Разрушает экземпляр класса
 * @name Controls/_popup/PopupHelper/Notification#destroy
 * @function
 * @example
 * <pre class="brush: js">
 *    import {NotificationOpener} from 'Controls/popup';
 *    ...
 *    this._notification = new NotificationOpener();
 *
 *    _beforeUnmount() {
 *        this._notification.destroy();
 *        this._notification = null;
 *    }
 * </pre>
 * @see open
 * @see close
 */
