define('Controls-demo/Previewer/Previewer', [
	'Core/Control',
	'Env/Env',
	'wml!Controls-demo/Previewer/Previewer',
	'Types/source',
	'css!Controls-demo/Previewer/Previewer',
], function(Control, Env, template, source) {
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
            this._resourceRoot = Env.constants.resourceRoot;
				this._triggerSource = new source.Memory({
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