/**
 * Класс устарел, используйте SBIS3.CONTROLS/Utils/ProtectedScope
 *
 * @public
 * @class SBIS3.CONTROLS/LongOperations/Tools/ProtectedScope
 */
define('SBIS3.CONTROLS/LongOperations/Tools/ProtectedScope', ['Core/IoC', 'SBIS3.CONTROLS/Utils/ProtectedScope'], function (IoC, Module) {
   IoC.resolve('ILogger').error('Deprecated', 'SBIS3.CONTROLS/LongOperations/Tools/ProtectedScope is deprecated, use SBIS3.CONTROLS/Utils/ProtectedScope instead');
   return Module;
});