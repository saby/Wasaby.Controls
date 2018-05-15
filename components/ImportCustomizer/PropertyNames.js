/**
 * Класс устарел, используйте SBIS3.CONTROLS/Utils/ImportExport/PropertyNames
 *
 * @public
 * @class SBIS3.CONTROLS/ImportCustomizer/PropertyNames
 */
define('SBIS3.CONTROLS/ImportCustomizer/PropertyNames', ['Core/IoC', 'SBIS3.CONTROLS/Utils/ImportExport/PropertyNames'], function (IoC, Module) {
   IoC.resolve('ILogger').error('Deprecated', 'SBIS3.CONTROLS/ImportCustomizer/PropertyNames is deprecated, use SBIS3.CONTROLS/Utils/ImportExport/PropertyNames instead');
   return Module;
});