import {IControlOptions} from 'UI/Base';
import {ICrud} from 'Types/source';
import {ICatalogMasterOptions} from 'Controls/_catalog/interfaces/ICatalogMasterOptions';
import {ICatalogDetailOptions} from 'Controls/_catalog/interfaces/ICatalogDetailOptions';

/**
 * Интерфейс описывает структуру настроек компонента Controls/_catalog/View
 * @interface Controls/_catalog/View/ICatalogOptions
 * @public
 * @author Уфимцев Д.Ю.
 */
export interface ICatalogOptions extends IControlOptions {
    /**
     * Базовый источник данных, который будет использован по умолчанию для списков, отображаемых в каталоге.
     * Может быть перекрыт на уровне конкретного блока каталога.
     *
     * @remark
     * Актуально использовать для уменьшения кол-ва задаваемых опций. Например, когда списки в обоих колонках используют
     * один и тот же источник данных
     *
     * @see {@link Controls/_catalog/View/ICatalogMasterOptions#listSource|ICatalogMasterOptions#listSource}
     * @see {@link Controls/_catalog/View/ICatalogDetailOptions#listSource|ICatalogDetailOptions#listSource}
     */
    listSource?: ICrud;

    /**
     * Конфигурация master-колонки. Если не задана, то мастер-колонка не отображается.
     * Также видимость мастер колонки можно регулировать опцией
     * {@link Controls/_catalog/View/ICatalogMasterOptions#visibility|visibility}
     *
     * @see {@link Controls/_catalog/View/ICatalogMasterOptions#visibility|ICatalogMasterOptions.visibility}
     */
    master?: ICatalogMasterOptions;

    /**
     * Конфигурация detail-колонки.
     */
    detail?: ICatalogDetailOptions;
}
