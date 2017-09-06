/**
 * Created by ps.borisov on 23.08.2016.
 */
define('js!SBIS3.CONTROLS.RichEditorRoundToolbar/resources/config',
   [
      'js!SBIS3.CONTROLS.RichTextArea/resources/smiles',
      'i18n!SBIS3.CONTROLS.RichEditor'
   ], function (smiles) {

      'use strict';

      return [
         {
            name: 'toggle',
            componentType: 'SBIS3.CONTROLS.IconButton',
            icon: 'sprite:icon-16 icon-View icon-primary',
            handlers: {
               onActivated: function() {
                  this.getParent().toggleToolbar();
               }
            },
            basic: true,
            order: 1
         },
         {
            name: 'styles',
            componentType: 'SBIS3.CONTROLS.IconButton',
            tooltip: rk('Стили'),
            icon: 'sprite:icon-16 icon-TFCurtailRTE2 icon-primary',
            className: 'controls-IconButton__round-border',
            handlers: {
               onActivated: function() {
                  this.getParent()._openStylesPanel(this);
               }
            },
            order: 10
         },

         {
            name: 'list',
            componentType: 'SBIS3.CONTROLS.MenuIcon',
            tooltip: rk('Вставить/Удалить список'),
            withoutHeader: true,
            icon   : 'sprite:icon-16 icon-ListMarked icon-primary',
            className: 'controls-IconButton__round-border',
            pickerClassName: 'controls-Menu__hide-menu-header controls-RichEditorToolbarMenu fre-list',
            items: [
               { key:'InsertUnorderedList', title:' ', icon:'sprite:icon-24 icon-ListMarked icon-primary' },
               { key:'InsertOrderedList', title:' ', icon:'sprite:icon-24 icon-ListNumbered icon-primary' }
            ],
            handlers: {
               onMenuItemActivate: function(event, key) {
                  this.getParent()._execCommand(key);
               }
            },
            idProperty: 'key',
            order: 20
         },

         {
            name: 'link',
            componentType: 'SBIS3.CONTROLS.IconButton',
            tooltip: rk('Вставить/редактировать ссылку'),
            icon: 'sprite:icon-16 icon-Link icon-primary',
            className: 'controls-IconButton__round-border',
            handlers:{
               onActivated: function(){
                  this.getParent()._insertLink();
               }
            },
            order: 30
         },

         {
            name: 'image',
            componentType: 'SBIS3.CONTROLS.IconButton',
            tooltip: rk('Вставить картинку'),
            icon: 'sprite:icon-16 icon-Picture icon-primary',
            className: 'controls-IconButton__round-border',
            handlers: {
               onActivated: function(event, originalEvent) {
                  this.getParent()._startFileLoad(this._container);
               }
            },
            order: 40
         },

         {
            name: 'smile',
            basic: true,
            tooltip: 'Вставить смайлик',
            componentType: 'SBIS3.CONTROLS.MenuIcon',
            icon: 'sprite:icon-16 icon-EmoiconSmile icon-primary',
            items: smiles,
            pickerClassName: 'controls-Menu__hide-menu-header controls-RichEditorToolbar__smilesPicker',
            multiselect: false,
            className: 'controls-IconButton__round-border',
            handlers: {
               onMenuItemActivate: function(event, key) {
                  this.getParent()._insertSmile(key);
               }
            },
            idProperty: 'key',
            order: 50
         },
         {
            name: 'history',
            caption: 'История ввода',
            componentType: 'SBIS3.CONTROLS.MenuIcon',
            icon: 'sprite:icon-16 icon-InputHistory icon-primary',
            pickerClassName: 'controls-RichEditorRoundToolbar__historyPicker',
            multiselect: false,
            className: 'controls-IconButton__round-border',
            handlers: {
               onMenuItemActivate: function(e, key) {
                  this.getParent()._setText(this.getItems().getRecordById(key).get('value'));
               }
            },
            idProperty: 'key',
            order: 60
         }
      ];
   });