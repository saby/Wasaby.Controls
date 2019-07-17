/**
 * Created by dv.zuev on 01.02.2018.
 */
define('Controls/Application/AppData', [
   'UI/Base',
   'Env/Env'
], function(UIBase, Env) {
   Env.IoC.resolve('ILogger').warn('Controls/Application/AppData will be removed in 19.600. Please use AppData from UI/Base instead.');
   return UIBase.AppData;
});
