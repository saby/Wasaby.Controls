import { Control } from 'UI/Base';
import { error as dataSourceError } from 'Controls/dataSource';
import { constants } from 'Env/Env';

type PopupId = string;

const popupHelper = new dataSourceError.Popup([
    'Core/Creator',
    'Controls/compatiblePopup'
], ['Controls/compatiblePopup']);
const POPUP_PRELOAD_TIMEOUT = 10000;

if (constants.isBrowserPlatform) {
    // Загружаем ресурсы, необходимые для показа ошибок.
    // Это делается не сразу, чтоб не мешать загрузке основного содержимого страницы.
    // Если обработка ошибки будет вызвана раньше, то при обрыве соединения или недоступности сервиса
    // придётся показать браузерный alert.
    setTimeout(() => {
        popupHelper.preloadPopup();
    }, POPUP_PRELOAD_TIMEOUT);
}

/**
 * Показать диалог с дружелюбным сообщением об ошибке.
 * Функцияя принимает следующие аргументы:
 * - error: Error - ошибка, которую надо обработать
 * - opener: Control - контрол, открывающий диалоговое окно
 *
 * В случае обрыва соединения или недоступности сервисов ресурсы, необходимые для показа диалогового окна, могут
 * не загрузиться, вэтом случае платформенное диалоговое окно открыть не получится и будет показан браузерный alert.
 * Для показа платформенных диалоговых окон необходимые ресурсы будут загружены асинхронно через 10 секунд после
 * загрузки этого модуля.
 *
 * Функция возвращает Promise. Если платформенный диалог открылся, то в промисе будет идентификатор окна,
 * этот идентификатор который надо использовать для закрытия окна через {@link Controls/_popup/interface/IDialog#closePopup}.
 *
 * @example
 * <pre>
 * import { process } from 'Controls/compatibleError';
 *
 * // Функция вызывает БЛ через Types/source:SbisService, возвращает результат метода call().
 * declare callMethod(): Promise<object>;
 *
 * function callAndHandleResult() {
 *     return callMethod().catch((error) => process(error));
 * }
 * </pre>
 *
 * @class Controls/_compatibleError/process
 * @public
 */
export default function process(error: Error, opener: Control = null): Promise<PopupId | void> {
    const controller = new dataSourceError.Controller({});
    return controller.process(error).then((viewConfig) => {
        if (!viewConfig) {
            return;
        }

        return popupHelper.openDialog(viewConfig, opener);
    });
}
