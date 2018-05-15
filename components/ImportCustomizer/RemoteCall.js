/**
 * Класс устарел, используйте SBIS3.CONTROLS/Utils/ImportExport/RemoteCall
 *
 * @public
 * @class SBIS3.CONTROLS/ImportCustomizer/RemoteCall
 */
define('SBIS3.CONTROLS/ImportCustomizer/RemoteCall', ['Core/IoC', 'SBIS3.CONTROLS/Utils/ImportExport/RemoteCall'], function (IoC, Module) {
   IoC.resolve('ILogger').error('Deprecated', 'SBIS3.CONTROLS/ImportCustomizer/RemoteCall is deprecated, use SBIS3.CONTROLS/Utils/ImportExport/RemoteCall instead');
   return Module;
});
