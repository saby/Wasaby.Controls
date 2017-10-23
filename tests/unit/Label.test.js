/**
 * Created by ms.zhuravlev on 23.06.2017.
 */
define(
   [
      'js!SBIS3.CONTROLS.Label',
      'js!SBIS3.CONTROLS.TextBox',
      'Core/vdom/Synchronizer/resources/SyntheticEvent'
   ],
   function(Label, TextBox, SyntheticEvent) {

      'use strict';

      var
         caption = 'Метка <span></span>',
         setCaption = 'Новая метка <div></div>',
         owner = 'TextBox',
         isEventClick = null,
         eventClick = null, label, textBox;

      describe('SBIS3.CONTROLS.Label', function() {
         beforeEach(function () {
            if (typeof $ === 'undefined') {
               this.skip();
            }
            label = new Label({
               caption: caption,
               owner: owner
            });
            textBox = new TextBox({
               name: owner
            });
         });

         afterEach(function () {
            label.destroy();
            textBox.destroy();
         });

         describe('State', function() {
            it('caption is string', function() {
               assert.isTrue(typeof label._options.caption === "string");
            });
            it('caption is true value', function() {
               assert.isTrue(label._options.caption === caption);
            });
            it('owner is string', function() {
               assert.isTrue(typeof label._options.owner === "string");
            });
            it('owner is true value', function() {
               assert.isTrue(label._options.owner === owner);
            });
         });

         describe('Setter', function() {
            it('setCaption', function() {
               label.setCaption(setCaption);
               assert.isTrue(label._options.caption === setCaption);
            });
         });

         describe('Event', function() {

            /*пока не понял что делают тесты, разобраться, раскомеентить, но такое ощущени, что focusin никогда не работало
            it('Enabled/Click', function() {
               textBox.subscribe('onFocusIn', function() {
                  isEventClick = true;
               });
               label.getOwner = function() {
                  return textBox;
               };
               eventClick = new SyntheticEvent("onclick", {
                  target: {
                     className: /class="(.*?)"/.exec(label._template())[1]
                  }
               });
               label._onClickHandler(eventClick);
               assert.isTrue(isEventClick);
               isEventClick = false;
            });
            it('Disabled/Click', function() {
               textBox.subscribe('onFocusIn', function() {
                  isEventClick = true;
               });
               label.getOwner = function() {
                  return textBox;
               };
               eventClick = new SyntheticEvent("onclick", {
                  target: {
                     className: /class="(.*?)"/.exec(label._template())[1]
                  }
               });
               label.setEnabled(false);
               label._onClickHandler(eventClick);
               assert.isTrue(!isEventClick);
            });*/
         });
      })
   }
);