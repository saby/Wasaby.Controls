define('Controls-demo/Popup/Opener/NotificationPG',
   [
      'Core/Control',
      'tmpl!Controls-demo/Popup/Opener/OpenerDemoPG',
      'json!Controls-demo/PropertyGrid/pgtext',
      'wml!Controls-demo/Popup/Opener/resources/BaseNotification',
      'wml!Controls-demo/Popup/Opener/resources/CustomNotification',
      'wml!Controls-demo/Popup/Opener/ConfirmationTpl',

      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper',
   ],

   function(Control, template, config) {
      'use strict';
      var DialogPG = Control.extend({
         _template: template,
         _metaData: null,
         _dataOptions: null,
         _content: 'Controls/Popup/Opener/Notification',
         _nameOpener: 'notificationOpener',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._dataObject = {
               className: {
                  readOnly: true
               },
               name: {
                  readOnly: true
               },
               template: {
                  items: [
                     {
                        id: '1',
                        title: 'wml!Controls-demo/Popup/Opener/resources/BaseNotification',
                        template: 'wml!Controls-demo/Popup/Opener/resources/BaseNotification'
                     },
                     {
                        id: '2',
                        title: 'wml!Controls-demo/Popup/Opener/resources/CustomNotification',
                        template: 'wml!Controls-demo/Popup/Opener/resources/CustomNotification'
                     }
                  ],
                  value: 'wml!Controls-demo/Popup/Opener/resources/BaseNotification'
               },
            };
            this._componentOptions = {
               name: 'Notification',
               className: 'controls-Notification-demoPG',
               template: 'wml!Controls-demo/Popup/Opener/resources/BaseNotification'
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return DialogPG;
   });
