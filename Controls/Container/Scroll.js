/**
 * Created by kraynovdo on 26.10.2017.
 */
define('js!Controls/Container/Scroll', [
   'Core/Control', 'tmpl!Controls/Container/Scroll'
], function(Control, ScrollTpl){
   'use strict';
   var Scroll = Control.extend({
      _template: ScrollTpl
   })
});