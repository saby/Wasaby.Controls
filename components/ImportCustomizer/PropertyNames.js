/**
 * Класс устарел, используйте {@link https://wi.sbis.ru/docs/js/SBIS3/CONTROLS/Utils/ImportExport/PropertyNames/ SBIS3.CONTROLS/Utils/ImportExport/PropertyNames}
 *
 * @public
 * @class SBIS3.CONTROLS/ImportCustomizer/PropertyNames
 * @deprecated
 */
define('SBIS3.CONTROLS/ImportCustomizer/PropertyNames', ['Core/IoC', 'SBIS3.CONTROLS/Utils/ImportExport/PropertyNames'], function (IoC, Module) {
   IoC.resolve('ILogger').error('Deprecated', 'SBIS3.CONTROLS/ImportCustomizer/PropertyNames is deprecated, use SBIS3.CONTROLS/Utils/ImportExport/PropertyNames instead');
   return Module;
});