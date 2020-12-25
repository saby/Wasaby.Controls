import {RecordSet} from 'Types/collection';
import {IListConfiguration} from 'Controls/_newBrowser/interfaces/IListConfiguration';
import {IOptions} from 'Controls/_newBrowser/interfaces/IOptions';
import {ISourceOptions} from 'Controls/_newBrowser/interfaces/ISourceOptions';

/**
 * Из метаданных RecordSet возвращает конфигурацию отображения списка
 * в detail-колонке
 */
export function getListConfiguration(items: RecordSet): IListConfiguration {
    // return items.getMetaData().listConfiguration;
    return items.getMetaData().results.get('ConfigurationTemplate');
}

/**
 * На основании переданных опиций собирает полный набор ISourceOptions для master- или detail-колонки
 */
export function compileSourceOptions(options: IOptions, forDetail: boolean): ISourceOptions {
    const specific = forDetail ? options.detail : options.master;

    return {
        root: specific.root || options.root,
        filter: specific.filter || options.filter,
        source: specific.source || options.source,
        columns: specific.columns || options.columns,
        keyProperty: specific.keyProperty || options.keyProperty,
        nodeProperty: specific.nodeProperty || options.nodeProperty,
        parentProperty: specific.parentProperty || options.parentProperty,
        displayProperty: specific.displayProperty || options.displayProperty,
        hasChildrenProperty: specific.hasChildrenProperty || options.hasChildrenProperty
    };
}
