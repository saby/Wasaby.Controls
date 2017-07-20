/**
 * Control for displaying data in Master-Detail format.
 *
 * Author: Ivan Uvarov (is.uvarov@tensor.ru)
 */
define('js!WSControls/Containers/MasterDetail',
   [
      'js!WSControls/Control/Base',
      'tmpl!WSControls/Containers/MasterDetail',
      'css!WSControls/Containers/MasterDetail'
   ],

   function (Base, template) {
      'use strict';

      /**
       * Control for displaying data in Master-Detail format.
       *
       * Options:
       * <ol>
       *    <li>master - component for master column.</li>
       *    <li>detail - component for detail column.</li>
       * </ol>
       *
       * @class WSControls/Containers/MasterDetail
       * @extends WSControls/Control/Base
       * @demo WSDemo/MasterDetail/MasterDetailDemo
       * @author Uvarov Ivan (is.uvarov)
       *
       * @css controls-MasterDetail__masterContainer Class for changing master column styles.
       * @css controls-MasterDetail__detailContainer Class for changing detail column styles.
       *
       * @control
       * @public
       */

      return Base.extend({
         _controlName: 'WSControls/Containers/MasterDetail',
         _template: template,
         _selected: null
      });
   }
);