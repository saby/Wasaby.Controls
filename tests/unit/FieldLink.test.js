/**
 * Created by am.gerasimov on 02.08.2017.
 */
/**
 * Created by am.gerasimov on 12.04.2017.
 */
define(['js!SBIS3.CONTROLS.FieldLink'], function (FieldLink) {
   'use strict';
   
   describe('SBIS3.CONTROLS.Utils.ItemsSelection', function () {
      
      context('need JQ', function() {
         var getContainer = function() {
               var elem = $('<div class="FieldLinkContainer"/>');
               elem.appendTo('body');
               return elem;
            },
            removeContainer = function() {
               $('.FieldLinkContainer').remove();
            };
         
         describe('FieldLink single select', function () {
            var fieldLink;
            
            before(function() {
               if(typeof window === 'undefined') {
                  this.skip();
               } else {
                  fieldLink = new FieldLink({
                     element: getContainer(),
                     displayProperty: 'title',
                     idProperty: 'id',
                     selectedItem: {id: 123, title: 'title'},
                     alwaysShowTextBox: true,
                     multiselect: false
                  });
               }
            });
            
            after(function() {
               if(typeof window !== 'undefined') {
                  fieldLink.destroy();
                  removeContainer();
               }
            });
            
            it('_getElementToFocus( multiselect: false, alwaysShowTextBox: true )', function() {
               assert.isTrue(fieldLink._getElementToFocus()[0] === fieldLink._getInputField()[0]);
            });
            
         });
      });
      
   })
});

