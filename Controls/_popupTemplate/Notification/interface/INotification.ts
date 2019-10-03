/**
 * Интерфейс для окна уведомления
 *
 * @interface Controls/_popupTemplate/Notification/interface/INotification
 * @public
 * @author Красильников А.С.
 */

/**
 * @name Controls/_popupTemplate/Notification/Simple#autoClose
 * @cfg {Number} Устанавливает интервал, по истечении которого окно закроется автоматически.
 * @default true
 */

/**
 * @name Controls/_popupTemplate/Notification/Base#style
 * @cfg {String} Устанавливает стиль отображения окна уведомления.
 * @variant warning
 * @variant secondary
 * @variant success
 * @variant danger
 * @default secondary
 */

/**
 * @name Controls/_popupTemplate/Notification/Base#closeButtonVisibility
 * @cfg {Boolean} Устанавливает видимость кнопки, закрывающей окно.
 * @default true
 */

export interface INotificationOptions {
    style?: String;
    icon?: String;
    autoClose?: Boolean;
    text?: String;
    closeButtonVisibility?: Boolean;
}

interface INotification {
    readonly '[Controls/_popupTemplate/Notification/interface/INotification]': boolean;
}

export default INotification;
