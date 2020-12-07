/**
 * Библиотека контрола каталога
 * @library Controls/catalog
 * @includes View Controls/_catalog/View
 * @includes ICatalogOptions Controls/_catalog/View/interfaces/ICatalogOptions
 * @includes ICatalogMasterOptions Controls/_catalog/interfaces/ICatalogMasterOptions
 * @includes ICatalogDetailOptions Controls/_catalog/interfaces/ICatalogDetailOptions
 * @includes CatalogDetailViewMode Controls/_catalog/interfaces/ICatalogDetailOptions
 * @author Уфимцев Д.Ю.
 */

export {default as View} from 'Controls/_catalog/View';
export {ICatalogOptions} from './_catalog/interfaces/ICatalogOptions';
export {ICatalogMasterOptions} from './_catalog/interfaces/ICatalogMasterOptions';
export {ICatalogDetailOptions, CatalogDetailViewMode} from './_catalog/interfaces/ICatalogDetailOptions';
