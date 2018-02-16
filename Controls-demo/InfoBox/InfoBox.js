define('Controls-demo/InfoBox/InfoBox',
   [
      'Core/Control',
      'tmpl!Controls-demo/InfoBox/resources/content',
      'tmpl!Controls-demo/InfoBox/InfoBox'
   ],
   function(Control, contentTpl, template) {

      'use strict';

      var items = [{
         text: 'LEFT', //1
         top: 0,
         left: 0,
         cfg: {
            message: 'MESSAGE',
            align: {
               horizontal: 'left',
               vertical: 'top'
            },
            corner: {
               vertical: 'top',
               horizontal: 'left'
            }
         }
      }, {
         text: 'CENTER',
         top: 0,
         left: 0,
         cfg: {
            message: 'MESSAGE',
            align: {
               horizontal: 'center',
               vertical: 'top'
            },
            corner: {
               vertical: 'top',
               horizontal: 'left'
            }
         }
      }, {
         text: 'RIGHT',
         top: 0,
         left: 0,
         cfg: {
            message: 'MESSAGE',
            align: {
               horizontal: 'right',
               vertical: 'top'
            },
            corner: {
               vertical: 'top',
               horizontal: 'left'
            }
         }
      }, {
         text: 'LEFT', //2
         top: 0,
         right: 0,
         cfg: {
            message: 'MESSAGE',
            align: {
               horizontal: 'left',
               vertical: 'top'
            },
            corner: {
               vertical: 'top',
               horizontal: 'right'
            }
         }
      }, {
         text: 'CENTER',
         top: 0,
         right: 0,
         cfg: {
            message: 'MESSAGE',
            align: {
               horizontal: 'center',
               vertical: 'top'
            },
            corner: {
               vertical: 'top',
               horizontal: 'right'
            }
         }
      }, {
         text: 'RIGHT',
         top: 0,
         right: 0,
         cfg: {
            message: 'MESSAGE',
            align: {
               horizontal: 'right',
               vertical: 'top'
            },
            corner: {
               vertical: 'top',
               horizontal: 'right'
            }
         }
      }, {
         text: 'LEFT', //3
         top: 0,
         right: 'calc(50% - 10px)',
         cfg: {
            message: 'MESSAGE',
            align: {
               horizontal: 'left',
               vertical: 'top'
            },
            corner: {
               vertical: 'top',
               horizontal: 'center'
            }
         }
      }, {
         text: 'CENTER',
         top: 0,
         right: 'calc(50% - 10px)',
         cfg: {
            message: 'MESSAGE',
            align: {
               horizontal: 'center',
               vertical: 'top'
            },
            corner: {
               vertical: 'top',
               horizontal: 'center'
            }
         }
      }, {
         text: 'RIGHT',
         top: 0,
         right: 'calc(50% - 10px)',
         cfg: {
            message: 'MESSAGE',
            align: {
               horizontal: 'right',
               vertical: 'top'
            },
            corner: {
               vertical: 'top',
               horizontal: 'center'
            }
         }
      }, {
         text: 'LEFT', //4
         bottom: 0,
         left: 0,
         cfg: {
            message: 'MESSAGE',
            align: {
               horizontal: 'left',
               vertical: 'bottom'
            },
            corner: {
               vertical: 'bottom',
               horizontal: 'left'
            }
         }
      }, {
         text: 'CENTER',
         bottom: 0,
         left: 0,
         cfg: {
            message: 'MESSAGE',
            align: {
               horizontal: 'center',
               vertical: 'bottom'
            },
            corner: {
               vertical: 'bottom',
               horizontal: 'left'
            }
         }
      }, {
         text: 'RIGHT',
         bottom: 0,
         left: 0,
         cfg: {
            message: 'MESSAGE',
            align: {
               horizontal: 'right',
               vertical: 'bottom'
            },
            corner: {
               vertical: 'bottom',
               horizontal: 'left'
            }
         }
      }, {
         text: 'LEFT', //5
         bottom: 0,
         right: 0,
         cfg: {
            message: 'MESSAGE',
            align: {
               horizontal: 'left',
               vertical: 'bottom'
            },
            corner: {
               vertical: 'bottom',
               horizontal: 'right'
            }
         }
      }, {
         text: 'CENTER',
         bottom: 0,
         right: 0,
         cfg: {
            message: 'MESSAGE',
            align: {
               horizontal: 'center',
               vertical: 'bottom'
            },
            corner: {
               vertical: 'bottom',
               horizontal: 'right'
            }
         }
      }, {
         text: 'RIGHT',
         bottom: 0,
         right: 0,
         cfg: {
            message: 'MESSAGE',
            align: {
               horizontal: 'right',
               vertical: 'bottom'
            },
            corner: {
               vertical: 'bottom',
               horizontal: 'right'
            }
         }
      }, {
         text: 'LEFT', //6
         bottom: 0,
         right: 'calc(50% - 10px)',
         cfg: {
            message: 'MESSAGE',
            align: {
               horizontal: 'left',
               vertical: 'bottom'
            },
            corner: {
               vertical: 'bottom',
               horizontal: 'center'
            }
         }
      }, {
         text: 'CENTER',
         bottom: 0,
         right: 'calc(50% - 10px)',
         cfg: {
            message: 'MESSAGE',
            align: {
               horizontal: 'center',
               vertical: 'bottom'
            },
            corner: {
               vertical: 'bottom',
               horizontal: 'center'
            }
         }
      }, {
         text: 'RIGHT',
         bottom: 0,
         right: 'calc(50% - 10px)',
         cfg: {
            message: 'MESSAGE',
            align: {
               horizontal: 'right',
               vertical: 'bottom'
            },
            corner: {
               vertical: 'bottom',
               horizontal: 'center'
            }
         }
      }, {
         text: 'LITE',
         top: 0,
         left: 0,
         cfg: {
            message: 'MESSAGE',
            style: 'lite'
         }
      }, {
         text: 'HELP',
         top: 0,
         left: 0,
         cfg: {
            message: 'MESSAGE',
            style: 'help'
         }
      }, {
         text: 'ERROR',
         top: 0,
         left: 0,
         cfg: {
            message: 'MESSAGE',
            style: 'error'
         }
      }, {
         text: 'CUSTOM TEMPLATE',
         top: 0,
         left: 0,
         cfg: {
            message: 'MESSAGE',
            contentTemplate: contentTpl
         }
      }];

      var InfoBox = Control.extend({
         _template: template,
         _items: items,

         _open: function(e, cfg){
            cfg.target = e.target;
            this._children.IBOpener.open(cfg);
         },

         _close: function(){
            this._children.IBOpener.close();
         }
      });

      return InfoBox;
   }
);