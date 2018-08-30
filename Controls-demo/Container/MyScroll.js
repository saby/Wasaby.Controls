define('Controls-demo/Container/MyScroll',
   [
      'Core/Control',
      'WS.Data/Query/Query',
      'WS.Data/Source/Memory',
      'WS.Data/Source/LocalSession',
      'wml!Controls-demo/Container/MyScroll',
      'Controls/List',
      'Controls/Toggle/Checkbox',
      'Controls/Container/Scroll',
      'Controls/Toggle/DoubleSwitch',
      'Controls/Popup/Opener/Dialog',
      'wml!Controls-demo/Container/resources/User',
      'wml!Controls-demo/Container/resources/UsersList',
      'wml!Controls-demo/Container/resources/MessagesList',
      'css!Controls-demo/Container/MyScroll'
   ],
   function(Control, Query, MemorySource, LocalSession, template) {

      'use strict';

      var srcUsersData = [
         {
            id: 1,
            name: 'Максим',
            avatar: 'EmoiconAngry',
            status: 'Занят.'
         },
         {
            id: 2,
            name: 'Андрей',
            avatar: 'EmoiconDevil',
            status: 'Свободен.'
         },
         {
            id: 3,
            name: 'Валера',
            avatar: 'EmoiconAnnoyed',
            status: 'Устал на работе.'
         },
         {
            id: 4,
            name: 'Саша',
            avatar: 'EmoiconBlind',
            status: 'В свободном поиске.'
         },
         {
            id: 5,
            name: 'Дима',
            avatar: 'EmoiconCool',
            status: 'Скучаю.'
         },
         {
            id: 6,
            name: 'Ваня',
            avatar: 'EmoiconLaugh',
            status: 'Жизнь боль!!!'
         },
         {
            id: 7,
            name: 'Петр',
            avatar: 'EmoiconMoney',
            status: 'Меня трудно найти, легко потерять и невозможно забыть.'
         },
         {
            id: 8,
            name: 'Никита',
            avatar: 'EmoiconLaughInvert',
            status: 'Люблю свободу.'
         },
         {
            id: 9,
            name: 'Элина',
            avatar: 'EmoiconTongue',
            status: 'Спокойствие, только спокойствие.'
         },
         {
            id: 10,
            name: 'Данила',
            avatar: 'EmoiconYawn',
            status: 'Сейчас бы в садик на тихий час.'
         }
      ];

      var Scroll = Control.extend({
         _template: template,

         _showShadow: true,

         _showScrollbar: true,

         _theme: true,

         _message: '',

         constructor: function() {
            Scroll.superclass.constructor.apply(this, arguments);

            this._usersSource = new MemorySource({
               idProperty: 'id',
               data: srcUsersData
            });

            this._messagesSource = new LocalSession({
               keyProperty: 'id',
               prefix: 'DSMS'
            });
         },

         _beforeMount: function() {
            var self = this;

            return this._usersSource.query(new Query()).addCallback(function(dataSet) {
               self._users = dataSet.getAll();
            });
         },

         _afterMount: function() {
            var self = this;
            this._messagesSource.query(new Query()).addCallback(function(dataSet) {
               var
                  data = dataSet.getAll(),
                  count = data.getCount();

               if (count) {
                  self._messageId = data.at(count - 1).get('id') + 1;
               } else {
                  self._messageId = 1;
               }
            });
         },

         _openUsersForSelect: function() {
            this._children.usersDialog.open();
         },

         _selectUser: function(event, item) {
            this._children.usersDialog.close();
            this._activeUser = item;
         },

         _sendMessage: function(event) {
            var self = this;

            if (this._activeUser) {
               this._messagesSource.create({
                  id: this._messageId++,
                  user: this._activeUser.get('id'),
                  message: this._message || 'Я забыл ввести текст!',
                  time: new Date()
               }).addCallback(function(model) {
                  self._messagesSource.update(model);
                  //self._children.messageList.reload();
               });
               this._message = '';
            } else {
               this._children.usersDialog.open();
            }
         },

         _deleteMessageHandler: function(event, item) {
            this._messagesSource.destroy(item.get('id'));
         }
      });

      return Scroll;
   }
);