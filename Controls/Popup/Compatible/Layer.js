/**
 * Created by as.krasilnikov on 14.05.2018.
 */
define('Controls/Popup/Compatible/Layer', [
   'Lib/Control/LayerCompatible/LayerCompatible',
   'Env/Env'
], function(LayerCompatible, Env) {
   'use strict';

   Env.IoC.resolve('ILogger').error(
      'Controls/Popup/Compatible/Layer',
      'This control is deprecated. Use \'Lib/Control/LayerCompatible/LayerCompatible\' instead'
   );

   return LayerCompatible;
});
