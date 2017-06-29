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

      describe('SBIS3.CONTROLS.Label', function() {
         beforeEach(function () {
            if (typeof $ === 'undefined') {
               this.skip();
            }
         });

         var
            caption = 'Метка <span></span>',
            setCaption = 'Новая метка <div></div>',
            owner = 'TextBox',
            isEventClick = null,
            eventClick = null, label, textBox;

         describe('State', function() {
            it('caption is string', function() {
               label = new Label({
                  caption: caption,
                  owner: owner
               });
               assert.isTrue(typeof label._options.caption === "string");
            });
            it('caption is true value', function() {
               label = new Label({
                  caption: caption,
                  owner: owner
               });
               assert.isTrue(label._options.caption === caption);
            });
            it('owner is string', function() {
               label = new Label({
                  caption: caption,
                  owner: owner
               });
               assert.isTrue(typeof label._options.owner === "string");
            });
            it('owner is true value', function() {
               label = new Label({
                  caption: caption,
                  owner: owner
               });
               assert.isTrue(label._options.owner === owner);
            });
         });

         describe('Setter', function() {
            it('setCaption', function() {
               label = new Label({
                  caption: caption,
                  owner: owner
               });
               label.setCaption(setCaption);
               assert.isTrue(label._options.caption === setCaption);
            });
         });

         describe('Event', function() {
            it('Enabled/Click', function() {
               label = new Label({
                  caption: caption,
                  owner: owner
               });
               textBox = new TextBox({
                  name: owner
               });
               textBox.subscribe('onFocusIn', function() {
                  isEventClick = true;
               });
               label.getOwner = function() {
                  return textBox;
               };
               eventClick = new SyntheticEvent("onclick", {
                  target: {
                     className: /class="(.*?)"/.exec(label._dotTplFn())[1]
                  }
               });
               label._onClickHandler(eventClick);
               assert.isTrue(isEventClick);
               isEventClick = false;
            });
            it('Disabled/Click', function() {
               label = new Label({
                  caption: caption,
                  owner: owner
               });
               textBox = new TextBox({
                  name: owner
               });
               textBox.subscribe('onFocusIn', function() {
                  isEventClick = true;
               });
               label.getOwner = function() {
                  return textBox;
               };
               eventClick = new SyntheticEvent("onclick", {
                  target: {
                     className: /class="(.*?)"/.exec(label._dotTplFn())[1]
                  }
               });
               label.setEnabled(false);
               label._onClickHandler(eventClick);
               assert.isTrue(!isEventClick);
            });
         });
      })
   }
);