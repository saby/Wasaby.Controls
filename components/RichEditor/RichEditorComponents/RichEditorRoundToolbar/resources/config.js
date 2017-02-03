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
            tooltip: rk('Стили'),
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
            items: [
               { key: 'InsertUnorderedList', title: ' ', icon:'sprite:icon-16 icon-ListMarked icon-primary' },
               { key: 'InsertOrderedList', title: ' ',icon:'sprite:icon-16 icon-ListNumbered icon-primary' }
            ],
            handlers: {
               onMenuItemActivate: function(event, key) {
                  this.getParent()._execCommand(key);
               }
            },
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
            componentType: 'SBIS3.CONTROLS.MenuIcon',
            icon: 'sprite:icon-16 icon-EmoiconSmile icon-primary',
            items: smiles,
            pickerClassName: 'controls-RichEditorRoundToolbar__smilesPicker',
            multiselect: false,
            className: 'controls-IconButton__round-border',
            handlers: {
               onMenuItemActivate: function(event, key) {
                  this.getParent()._insertSmile(key);
               }
            },
            order: 50
         },
         {
            name: 'history',
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
            order: 60
         }
      ];
   });