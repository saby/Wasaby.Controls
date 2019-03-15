define('Controls-demo/InfoBox/Opener/InfoBox',
   [
      'Core/Control',
      'wml!Controls-demo/InfoBox/resources/content',
      'wml!Controls-demo/InfoBox/Opener/InfoBox',
      'css!Controls-demo/InfoBox/Opener/InfoBox'
   ],
   function(Control, contentTpl, template) {

      'use strict';

      var message = 'MESSAGE';
      var InfoBox = Control.extend({
         _template: template,
         _blocks: null,
         _minTargetMode: false,
         _beforeMount: function() {
            this._blocks = [{
               header: 'POSITION',
               items: [{
                  text: 'TL',
                  cfg: {
                     message: message,
                     position: 'tl'
                  }
               }, {
                  text: 'TC',
                  cfg: {
                     message: message,
                     position: 'tc'
                  }
               }, {
                  text: 'TR',
                  cfg: {
                     message: message,
                     position: 'tr'
                  }
               }, {
                  text: 'BL',
                  cfg: {
                     message: message,
                     position: 'bl'
                  }
               }, {
                  text: 'BC',
                  cfg: {
                     message: message,
                     position: 'bc'
                  }
               }, {
                  text: 'BR',
                  cfg: {
                     message: message,
                     position: 'br'
                  }
               }, {
                  text: 'LT',
                  cfg: {
                     message: message,
                     position: 'lt'
                  }
               }, {
                  text: 'LC',
                  cfg: {
                     message: message,
                     position: 'lc'
                  }
               }, {
                  text: 'LB',
                  cfg: {
                     message: message,
                     position: 'lb'
                  }
               }, {
                  text: 'RT',
                  cfg: {
                     message: message,
                     position: 'rt'
                  }
               }, {
                  text: 'RC',
                  cfg: {
                     message: message,
                     position: 'rc'
                  }
               }, {
                  text: 'RB',
                  cfg: {
                     message: message,
                     position: 'rb'
                  }
               }]
            }, {
               header: 'STYLE',
               items: [{
                  text: 'DEFAULT',
                  cfg: {
                     message: message,
                     style: 'default'
                  }
               }, {
                  text: 'ERROR',
                  cfg: {
                     message: message,
                     style: 'error'
                  }
               }]
            }, {
               header: 'FLOAT',
               items: [{
                  text: 'TRUE',
                  cfg: {
                     message: 'American classical artists have long been known for their remarkable virtuosity.\n' +
                        ' Every year the level of their music art is getting higher.\n' +
                        ' Never before have so many unusually gifted American conductors organized\n' +
                        ' lots of the country’s most prominent orchestras.',
                     float: true
                  }
               }, {
                  text: 'FALSE',
                  cfg: {
                     message: 'American classical artists have long been known for their remarkable virtuosity.\n' +
                        ' Every year the level of their music art is getting higher.\n' +
                        ' Never before have so many unusually gifted American conductors organized\n' +
                        ' lots of the country’s most prominent orchestras.',
                     float: false
                  }
               }]
            }, {
               header: 'CONTENT',
               items: [{
                  text: 'CUSTOM',
                  cfg: {
                     template: contentTpl,
                     templateOptions: {
                        message: message
                     }
                  }
               }]
            }];
         },

         _open: function(e, cfg){
            cfg.target = e.target;
            this._children.IBOpener.open(cfg);
         },

         _toggleMinTargetMode: function(){
            this._minTargetMode = !this._minTargetMode;
         }
      });

      return InfoBox;
   }
);