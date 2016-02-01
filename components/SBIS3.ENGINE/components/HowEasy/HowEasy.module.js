/* global define: false, $: false */
define('js!SBIS3.Engine.HowEasy', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.Engine.HintManager',
   'html!SBIS3.Engine.HowEasy',
   'html!SBIS3.Engine.HowEasy/items',
   'css!SBIS3.Engine.HowEasy'
], function(
   CompoundControl,
   hintManager,
   dotTplFn,
   itemsTpl
) {
   'use strict';

   var HowEasy = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            helpLink: '',
            hideHeader: false
         }
      },
      $constructor: function () {
         var self = this,
            channel = $ws.single.EventBus.channel('navigation');
         this._itemsCnt = this.getContainer().find('#howEasy__list');
         this._listCnt = this.getContainer().find('.engine-HowEasy');
         /**
          * При фиксации блока внизу страницы выносим его в DOM на несколько уровней вверх,
          * после блока .sidebar, чтобы он был фиксированно прибит к нижней границе страницы.
          */
         this._origParent = this.getContainer().parent();
         this._phantom = $('<div class="phantomBird" style="margin-top: 50px;">');
         this._phantom.appendTo(this._origParent);
         this._sidebar = $('.sidebar');
         this._accordion = document.getElementById('leftInfoBlocks');
         this._template = document.getElementById('accordionTemplate');
         this.getContainer().attr({'class': 'birdSticker', 'id': ''});
         channel.subscribe('onNavigate', function (event, regionId, elementId, data) {
            var helpRegion = '';
            if (regionId === 'left') {
               try {
                  var dataParse = JSON.parse(data);
                  if (dataParse.helpRegion) {
                     helpRegion = dataParse.helpRegion;
                  }
               }
               catch (e) {
                  if (data.helpRegion) {
                     helpRegion = data.helpRegion;
                  }
               }
               if (helpRegion) {
                  $.ajax({
                     url: '/navigation/get-structure/' + helpRegion + '/',
                     type: 'POST',
                     dataType: 'json',
                     complete: function (response) {
                        try {
                           var structure = $.parseJSON(response.responseText);
                        } catch (e) {
                           self._itemsCnt.empty();
                           structure = [];
                        }
                        structure = $ws.helpers.filter(structure, (function (item) {
                           return !item.forbidden;
                        }));
                        if (structure.length) {
                           self._itemsCnt.html(itemsTpl(structure));
                           // TODO добавлять используемые скрипты из item.data.action ?
                           // TODO у ссылки устанавливать режим открытия (target:_blank) ?
                        } else {
                           self._itemsCnt.empty();
                        }
                        self._phantom.height(self.getContainer().height());
                        self.recalcBird();
                     }
                  });
               } else {
                  self._itemsCnt.empty();
                  self._phantom.height(self.getContainer().height());
                  self.recalcBird();
               }
            }
         });
         this.fixedBirdForGrayTheme();
      },
      init: function() {
         HowEasy.superclass.init.apply(this, arguments);
         // фиксируем блок в углу страницы, выносим его после sidebar-а
         this.getContainer().addClass('fixed');
         this._sidebar.after(this.getContainer());
         this._phantom.height(this.getContainer().height());
         this._container.find('.engine-HowEasy__question').click(function() {
            hintManager.animateToggle();
         });
      },
      hideHeader: function() {
         this._listCnt.css('display', 'none');
      },
      showHeader: function() {
         this._listCnt.css('display', 'block');
      },
      recalcBird: function () {
         var scrolled = this._sidebar.hasClass('interface-no-scroll') ? this._sidebar.get(0).scrollTop : (window.pageYOffset || document.documentElement.scrollTop),
             bird = this._container,
             accordion = this._accordion;

         // в iOS бывают отрицательные скроллы, учитываем эту особенность.
         scrolled = (scrolled < 0) ? 0 : scrolled;

         // Тут еще старый аккордеон (на локальных стендах определяем по отсутствию #leftInfoBlocks на странице)
         if (/reg.tensor.ru/.test(location.href) || !this._accordion) {
            accordion = this._template;
         }

         if (accordion) {
            var topContent = parseInt(this._sidebar.get(0).scrollHeight, 10),
               windowHeight = window.innerHeight ? window.innerHeight : $(window).height();
            bird.css('bottom', Math.min(windowHeight - topContent + scrolled, 0));
         }
      },

      fixedBirdForGrayTheme: function () {
         var self = this;
         $(function () {
            self.recalcBird();

            $ws.single.EventBus.channel('LeftNavigationChannel').subscribe('onResize', self.recalcBird.bind(self));

            $ws.requireModule('SBIS3.CORE.Control').addCallback(function () {
               $ws.single.ControlStorage.waitChild('accordionTemplate').addCallback(function (control) {
                  control.subscribe('onBatchFinished', self.recalcBird.bind(self));
                  return control;
               });
            });
         });
         window.onscroll = window.onresize = this.recalcBird.bind(this);
         $ws.single.EventBus.globalChannel().subscribe('onBodyMarkupChanged', self.recalcBird.bind(self));
         $ws._const.$win.bind('touchmove', this.recalcBird.bind(this));
      },

      fixedBirdForStartTheme: function () {
         this.recalcBird();
         window.onscroll = window.onresize = this.recalcBird.bind(this);
      }
   });

   return HowEasy;
});