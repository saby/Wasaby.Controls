/**
 * Created by am.gerasimov on 13.04.2018.
 */
/**
 * Created by am.gerasimov on 13.12.2017.
 */
define('Controls-demo/Suggest/resources/SuggestTemplate', [
   'Core/Control',
   'wml!Controls-demo/Suggest/resources/SuggestTemplate',
   'Controls/list'
], function(Control, template) {

   'use strict';

   return Control.extend({
      _template: template
   });

});
