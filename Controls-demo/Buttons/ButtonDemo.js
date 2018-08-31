define('Controls-demo/Buttons/ButtonDemo', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/Buttons/ButtonDemo',
   'WS.Data/Collection/RecordSet',
   'css!Controls-demo/Headers/headerDemo',
   'css!Controls-demo/Headers/resetButton'
], function(Control,
   MemorySource,
   template) {
   'use strict';
   var ModuleClass = Control.extend(
      {
         _template: template,
         _selectedStyle: 'iconButtonBorderedAdditional',
         _styleSource: null,
         _selectedSize: 'm',
         _sizeSource: null,
         _caption: '',
         _icon: 'icon-16 icon-Send',
         _iconStyleSource: null,
         _selectedIconStyle: 'default',
         _tooltip: '',
         _eventName: 'no event',
         maximumNumberOfSize: null,
         _beforeMount: function() {
            this._sizeSource = new MemorySource({
               idProperty: 'title',
               data: [
                  {
                     title: 'm'
                  },
                  {
                     title: 'l'
                  }
               ]
            });
            this.maximumNumberOfSize = new MemorySource({
               idProperty: 'title',
               data: [
                  {
                     title: 's'
                  },
                  {
                     title: 'm'
                  },
                  {
                     title: 'l'
                  },
                  {
                     title: 'xl'
                  }
               ]
            });
            this._styleSource = new MemorySource({
               idProperty: 'title',
               data: [
                  {
                     title: 'iconButtonBorderedAdditional',
                     sizeSource: this._sizeSource
                  },
                  {
                     title: 'iconButtonBordered',
                     sizeSource: this._sizeSource
                  },
                  {
                     title: 'linkMain',
                     sizeSource: this.maximumNumberOfSize
                  },
                  {
                     title: 'linkMain2',
                     sizeSource: this.maximumNumberOfSize
                  },
                  {
                     title: 'linkMain3',
                     sizeSource: this.maximumNumberOfSize
                  },
                  {
                     title: 'linkAdditional',
                     sizeSource: this.maximumNumberOfSize
                  },
                  {
                     title: 'linkAdditional2',
                     sizeSource: this.maximumNumberOfSize
                  },
                  {
                     title: 'linkAdditional3',
                     sizeSource: this.maximumNumberOfSize
                  },
                  {
                     title: 'linkAdditional4',
                     sizeSource: this.maximumNumberOfSize
                  },
                  {
                     title: 'linkAdditional5',
                     sizeSource: this.maximumNumberOfSize
                  },
                  {
                     title: 'buttonPrimary',
                     sizeSource: this._sizeSource
                  },
                  {
                     title: 'buttonDefault',
                     sizeSource: this._sizeSource
                  },
                  {
                     title: 'buttonAdd',
                     sizeSource: this._sizeSource
                  }
               ]
            });
            this._iconStyleSource = new MemorySource({
               idProperty: 'title',
               data: [
                  {
                     title: 'default'
                  },
                  {
                     title: 'done'
                  },
                  {
                     title: 'attention'
                  },
                  {
                     title: 'error'
                  }
               ]
            });
         },
         clickHandler: function(e) {
            this._eventName = 'click';
         },

         changeIconStyles: function(e, key) {
            this._selectedIconStyle = key;
         },

         changeStyle: function(e, key) {
            this._selectedStyle = key;
            var self = this;
            this._styleSource.read(key).addCallback(function(item) {
               self._sizeSource = item.get('sizeSource');
            });
         },

         changeSize: function(e, key) {
            this._selectedSize = key;
         },

         reset: function() {
            this._eventName = 'no event';
         }
      }
   );
   return ModuleClass;
});
