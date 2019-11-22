/**
 * Интерфейс для окна подтверждения.
 *
 * @interface Controls/_popup/Opener/interface/IConfirmation
 * @public
 * @author Красильников А.С.
 */

/**
 * @name Controls/_popup/Opener/interface/IConfirmation#type
 * @cfg {String} Тип диалогового окна. Определяет с каким результатом будет закрыто окно подтверждения.
 * @variant ok (Результат: undefined)
 * @variant yesno (Результат: true/false)
 * @variant yesnocancel (Результат: true/false/undefined)
 * @default yesno
 */

/**
 * @name Controls/_popup/Opener/interface/IConfirmation#style
 * @cfg {String} Внешний вид диалога подтверждения.
 * @variant default
 * @variant success
 * @variant danger
 * @default default
 */

/**
 * @name Controls/_popup/Opener/interface/IConfirmation#size
 * @cfg {String} Размер диалога подтверждения. Размер меняется автоматически, если длина основного сообщения превышает
 * 100 символов или длина дополнительного текста превышает 160 символов.
 * @variant m (ширина 350px)
 * @variant l (ширина 440px)
 * @default m
 */

/**
 * @name Controls/_popup/Opener/interface/IConfirmation#message
 * @cfg {String} Основной текст диалога подтверждения.
 */

/**
 * @name Controls/_popup/Opener/interface/IConfirmation#details
 * @cfg {String} Дополнительный текст диалога подтверждения
 */

/**
 * @name Controls/_popup/Opener/interface/IConfirmation#yesCaption
 * @cfg {String} Текст кнопки подтверждения.
 * @default Да
 */

/**
 * @name Controls/_popup/Opener/interface/IConfirmation#noCaption
 * @cfg {String} Текст кнопки отрицания
 * @default Нет
 */

/**
 * @name Controls/_popup/Opener/interface/IConfirmation#cancelCaption
 * @cfg {String} Текст кнопки отмены
 * @default Отмена
 */

/**
 * @name Controls/_popup/Opener/interface/IConfirmation#primaryAction
 * @cfg {String} Определяет, какая кнопка будет активирована по нажатию ctrl+enter
 * @variant yes
 * @variant no
 * @default yes
 */

/**
 * @name Controls/_popup/Opener/interface/IConfirmation#okCaption
 * @cfg {String} Текст кнопки "принять"
 * @default ОК
 */
export interface IConfirmationOptions {

    type?: string;
    style?: string;
    size?: string;
    message?: string;
    details?: string;
    yesCaption?: string;
    noCaption?: string;
    cancelCaption?: string;
    primaryAction?: string;
    okCaption?: string;
}

interface IConfirmation {
    readonly '[Controls/_popup/Opener/interface/IConfirmation]': boolean;
}

export default IConfirmation;
