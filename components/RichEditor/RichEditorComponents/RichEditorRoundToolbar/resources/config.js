/**
 * Created by ps.borisov on 23.08.2016.
 */
define('js!SBIS3.CONTROLS.RichEditorRoundToolbar/resources/config',
   [
      'js!SBIS3.CONTROLS.RichEditorRoundToolbar/resources/handlers',
      'js!SBIS3.CONTROLS.RichTextArea/resources/smiles',
      'i18n!SBIS3.CONTROLS.RichEditor'
   ], function (handlers, smiles) {

      'use strict';

      return function () {
         return [
         {
            name: 'toggle',
            componentType: 'SBIS3.CONTROLS.IconButton',
            icon: 'sprite:icon-16 icon-View icon-primary',
            handlers: {
               onActivated: handlers.toggle
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
               onActivated: handlers.styles
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
               onMenuItemActivate: handlers.list
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
               onActivated: handlers.link
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
               onActivated: handlers.image
            },
            order: 40
         },

         {
            name: 'smile',
            basic: true,
            tooltip: rk('Вставить смайлик'),
            componentType: 'SBIS3.CONTROLS.MenuIcon',
            icon: 'sprite:icon-16 icon-EmoiconSmile icon-primary',
            items: smiles,
            pickerClassName: 'controls-Menu__hide-menu-header controls-RichEditorToolbar__smilesPicker',
            multiselect: false,
            className: 'controls-IconButton__round-border',
            handlers: {
               onMenuItemActivate: handlers.smile
            },
            idProperty: 'key',
            order: 50
         },
         {
            name: 'history',
            caption: rk('История ввода'),
            componentType: 'SBIS3.CONTROLS.MenuIcon',
            icon: 'sprite:icon-16 icon-InputHistory icon-primary',
            pickerClassName: 'controls-RichEditorRoundToolbar__historyPicker',
            multiselect: false,
            className: 'controls-IconButton__round-border',
            handlers: {
               onMenuItemActivate: handlers.history
            },
            idProperty: 'key',
            order: 60
         }
      ];
      };
   });