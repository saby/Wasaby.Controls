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
         _icons: null,
         _cfgRight: null,
         _cfgLeft: null,
         _cfgTop: null,
         _cfgBottom: null,
         _minTargetMode: false,
         _beforeMount: function() {
            this._cfgRight = {
               message: message,
               targetSide: 'right',
               alignment: 'start'
            };
            this._cfgLeft = {
               message: message,
               targetSide: 'left',
               alignment: 'start'
            };
            this._cfgTop = {
               message: message,
               targetSide: 'top',
               alignment: 'start'
            };
            this._cfgBottom = {
               message: message,
               targetSide: 'bottom',
               alignment: 'start'
            };
            this._blocks = [{
               header: 'POSITION',
               items: [{
                  text: 'TOP START',
                  cfg: {
                     message: message,
                     targetSide: 'top',
                     alignment: 'start'
                  }
               }, {
                  text: 'TOP CENTER',
                  cfg: {
                     message: message,
                     targetSide: 'top',
                     alignment: 'center'
                  }
               }, {
                  text: 'TOP END',
                  cfg: {
                     message: message,
                     targetSide: 'top',
                     alignment: 'end'

                  }
               }, {
                  text: 'BOTTOM START',
                  cfg: {
                     message: message,
                     targetSide: 'bottom',
                     alignment: 'start'
                  }
               }, {
                  text: 'BOTTOM CENTER',
                  cfg: {
                     message: message,
                     targetSide: 'bottom',
                     alignment: 'center'
                  }
               }, {
                  text: 'BOTTOM END',
                  cfg: {
                     message: message,
                     targetSide: 'bottom',
                     alignment: 'end'
                  }
               }, {
                  text: 'LEFT START',
                  cfg: {
                     message: message,
                     targetSide: 'left',
                     alignment: 'start'
                  }
               }, {
                  text: 'LEFT CENTER',
                  cfg: {
                     message: message,
                     targetSide: 'left',
                     alignment: 'center'
                  }
               }, {
                  text: 'LEFT END',
                  cfg: {
                     message: message,
                     targetSide: 'left',
                     alignment: 'end'
                  }
               }, {
                  text: 'RIGHT START',
                  cfg: {
                     message: message,
                     targetSide: 'right',
                     alignment: 'start'
                  }
               }, {
                  text: 'RIGHT CENTER',
                  cfg: {
                     message: message,
                     targetSide: 'right',
                     alignment: 'center'
                  }
               }, {
                  text: 'RIGHT END',
                  cfg: {
                     message: message,
                     targetSide: 'right',
                     alignment: 'end'
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
                  text: 'DANGER',
                  cfg: {
                     message: message,
                     style: 'danger'
                  }
               }, {
                  text: 'WARNING',
                  cfg: {
                     message: message,
                     style: 'warning'

                  }
               }, {
                  text: 'SUCCESS',
                  cfg: {
                     message: message,
                     style: 'success'

                  }
               }, {
                  text: 'SECONDARY',
                  cfg: {
                     message: message,
                     style: 'secondary'

                  }
               }, {
                  text: 'INFO',
                  cfg: {
                     message: message,
                     style: 'info'
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
            this._icons = [{
               items: [
                  {
                     cfg: {
                        size: 'small',
                        position: 'lc',
                        message: 'Small left-center'
                     }
                  },
                  {
                     cfg: {
                        size: 'small',
                        position: 'tc',
                        message: 'Small top-center'
                     }
                  },
                  {
                     cfg: {
                        size: 'small',
                        position: 'bc',
                        message: 'Small bottom-center'
                     }
                  },
                  {
                     cfg: {
                        size: 'small',
                        position: 'rc',
                        message: 'Small right-center'
                     }
                  }
               ]
            },
            {
               items: [
                  {
                     cfg: {
                        size: 'medium',
                        position: 'lc',
                        message: 'Medium left-center'
                     }
                  },
                  {
                     cfg: {
                        size: 'medium',
                        position: 'tc',
                        message: 'Medium top-center'
                     }
                  },
                  {
                     cfg: {
                        size: 'medium',
                        position: 'bc',
                        message: 'Medium bottom-center'
                     }
                  },
                  {
                     cfg: {
                        size: 'medium',
                        position: 'rc',
                        message: 'Medium right-center'
                     }
                  },
               ]
            },
            {
               items: [
                  {
                     cfg: {
                        size: 'large',
                        position: 'lc',
                        message: 'Large left-center'
                     }
                  },
                  {
                     cfg: {
                        size: 'large',
                        position: 'tc',
                        message: 'Large top-center'
                     }
                  },
                  {
                     cfg: {
                        size: 'large',
                        position: 'bc',
                        message: 'Large bottom-center'
                     }
                  },
                  {
                     cfg: {
                        size: 'large',
                        position: 'rc',
                        message: 'Large right-center'
                     }
                  },
               ]
            }
            ];
         },

         _open: function(e, cfg) {
            cfg.target = e.target;
            this._children.IBOpener.open(cfg);
         },

         _toggleMinTargetMode: function() {
            this._minTargetMode = !this._minTargetMode;
         }
      });

      return InfoBox;
   });
