/**
 * Created by am.gerasimov on 21.11.2017.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.BreadCrumbs'
], function (BreadCrumbs) {
   'use strict';
   describe('SBIS3.CONTROLS.BreadCrumbs', function () {
      beforeEach(function () {
         if (typeof $ === 'undefined') {
            this.skip();
         }
      });
      
      describe('check DOM', function() {
         it('check in title', function() {
            var container = $('<div></div>').appendTo('body'),
               items = [{title: '&quot;&quot;&quot;', id: '&quot;'}],
               bc = new BreadCrumbs({
                  items: items,
                  displayProperty: 'title',
                  idProperty: 'id',
                  element: container
               });
            
            assert.equal(bc.getContainer().find('.controls-BreadCrumbs__itemsContainer .controls-BreadCrumbs__crumb').attr('title'), '"""');
            bc.destroy();
         });
      });
   });
});