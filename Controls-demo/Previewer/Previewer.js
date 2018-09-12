define('Controls-demo/Previewer/Previewer', [
	'Core/Control',
	'wml!Controls-demo/Previewer/Previewer',
	'WS.Data/Source/Memory',
	'css!Controls-demo/Previewer/Previewer',
],
function(Control, template, MemorySource) {
	'use strcit';

	var Previewer = Control.extend({
		_template: template,
		_triggerSource: null,
		_caption1: 'hover',
		_caption2: 'click',
		_trigger: 'hover',
		_value: true,	
		_selectedTrigger: 'hover',

		_beforeMount: function() {
			this._triggerSource = new MemorySource({
			   idProperty: 'title',
			   data: [
				  {title: 'hover'},
				  {title: 'click'}
			   ]
			});
        },
		
		changeTrigger: function(e, key) {
			this._selectedTrigger = key;
			this._trigger = key;
		}
		
      });

      Previewer.getDefaultOptions = function() {
         return {
            imgRoot: '/'
         };
      };

      return Previewer;
   }
);