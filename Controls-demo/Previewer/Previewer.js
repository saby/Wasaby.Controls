define('Controls-demo/Previewer/Previewer', [
	'Core/Control',
	'Core/constants',
	'wml!Controls-demo/Previewer/Previewer',
	'WS.Data/Source/Memory',
	'css!Controls-demo/Previewer/Previewer',
], function(Control, constants, template, MemorySource) {
		'use strcit';

		var Previewer = Control.extend({
			_template: template,
			_triggerSource: null,
			_caption1: 'hover',
			_caption2: 'click',
			_trigger: 'hoverAndClick',
			_value: true,	
			_selectedTrigger: 'hoverAndClick',

			_beforeMount: function() {
            this._resourceRoot = constants.resourceRoot;
				this._triggerSource = new MemorySource({
					idProperty: 'title',
					data: [
						{title: 'hoverAndClick'},
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

		return Previewer;

	}
);