/**
 * Control for displaying data in Master-Detail format.
 *
 * Author: Ivan Uvarov (is.uvarov@tensor.ru)
 */
define('js!WSControls/MasterDetail/MasterDetail',
   [
      'js!WSControls/Control/Base',
      'tmpl!WSControls/MasterDetail/MasterDetail',
      'css!WSControls/MasterDetail/MasterDetail'
   ],

   function (Control, template) {
      'use strict';

      var MasterDetail = Control.extend({
         _controlName: 'WSControls/MasterDetail/MasterDetail',
         _template: template,
         iWantVDOM: true,
         selected: null,

         constructor: function(cfg) {
            MasterDetail.superclass.constructor.call(this, cfg);
         }
      });

      return MasterDetail;
   }
);