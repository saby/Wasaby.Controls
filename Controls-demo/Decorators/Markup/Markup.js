define('Controls-demo/Decorators/Markup/Markup', [

   'Core/Control',
   'Controls/Decorator/Markup/resolvers/linkDecorate',
   'wml!Controls-demo/Decorators/Markup/Markup',

   'css!Controls-demo/Decorators/Markup/Markup',
   'Controls/Decorator/Markup'

], function(Control,
   linkDecorateResolver,
   template) {
   'use strict';

   return Control.extend({
      _template: template,
      statuses: {
         '-1': 'не проверено',
         'false': 'неверно',
         'true': 'верно',
         '0': 'неверно',
         '1': 'верно'
      },
      globalStatus: 2,
      _afterMount: function() {
         if (!document) {
            return;
         }
         var testValues = this.testValues,
            globalStatus = 1;
         for (var i = 0; i < testValues.length; ++i) {
            if (document.getElementById('ControlsDemo-Markup__case' + i)) {
               var checkHtml = document.getElementById('ControlsDemo-Markup__case' + i).outerHTML.replace(/ class=""/g, '');
               globalStatus &= testValues[i].status = checkHtml === testValues[i].goodHtml;
            } else {
               globalStatus = 0;
            }
         }
         this.globalStatus = globalStatus;
         this._forceUpdate();
      },
      testValues: [
         {
            value: [],
            tagResolver: undefined,
            className: '',
            goodHtml: '<span id="ControlsDemo-Markup__case0" tabindex="0"></span>',
            status: -1
         },
         {
            value: [['p', '123']],
            tagResolver: function() {
               return ['strong', ['em', '456']];
            },
            className: '',
            goodHtml: '<strong id="ControlsDemo-Markup__case1" tabindex="0"><em>456</em></strong>',
            status: -1
         },
         {
            value: [['p', '123']],
            tagResolver: undefined,
            className: '',
            goodHtml: '<div id="ControlsDemo-Markup__case2" tabindex="0"><p>123</p></div>',
            status: -1
         },
         {
            value: [['p']],
            tagResolver: undefined,
            className: 'myClassName',
            goodHtml: '<div id="ControlsDemo-Markup__case3" tabindex="0" class="myClassName"><p></p></div>',
            status: -1
         },
         {
            value: [['p', '123'], ['p', '456']],
            tagResolver: undefined,
            className: '',
            goodHtml: '<div id="ControlsDemo-Markup__case4" tabindex="0"><p>123</p><p>456</p></div>',
            status: -1
         },
         {
            value: [['p', ['a', { rel: 'noreferrer', 'href': 'https://ya.ru', target: '_blank' }, 'https://ya.ru']]],
            tagResolver: undefined,
            className: '',
            goodHtml: '<div id="ControlsDemo-Markup__case5" tabindex="0"><p><a rel="noreferrer" href="https://ya.ru" target="_blank">https://ya.ru</a></p></div>',
            status: -1
         },
         {
            value: [
               ['p',
                  ['a',
                     {
                        'href': 'https://ya.ru',
                        target: '_blank',
                        rel: 'noreferrer',
                        'class': 'myLink'
                     },
                     'https://ya.ru'
                  ]
               ]
            ],
            tagResolver: linkDecorateResolver,
            className: '',
            goodHtml: '<div id="ControlsDemo-Markup__case6" tabindex="0"><p><span class="LinkDecorator__wrap"><a class="myLink LinkDecorator__linkWrap" href="https://ya.ru" target="_blank" rel="noreferrer"><img class="LinkDecorator__image" alt="https://ya.ru" src="TODO"></a></span></p></div>',
            status: -1
         }
      ],
      json: [],
      strJson: '',
      tagResolver: linkDecorateResolver,
      _setJson: function(e, value) {
         this.strJson = value;
      },
      _applyJson: function(event) {
         if (event.type === 'click' || event.nativeEvent.code === 'Enter') {
            try {
               this.json = JSON.parse(this.strJson);
            } catch (e) {
               this.json = ['span', { 'class': 'ControlsDemo-Markup__error' }, e.message];
            }
         }
      }
   });
});
