define('js!SBIS3.CONTROLS.Demo.MyToggleHeader',
	[
		'js!SBIS3.CONTROLS.CompoundControl',
		'tmpl!SBIS3.CONTROLS.Demo.MyToggleHeader',
		'js!SBIS3.CONTROLS.ToggleHeader'
	],
	function(CompoundControls, dorTplFn) {

		'use strict';

		var MyToggleHeader = CompoundControls.mixin({
			_dotTplFn: dorTplFn,

			after: {
				init: function() {
					var
						button = this.getChildControlByName('button'),
						toggleHeader = this.getChildControlByName('toggleHeader');

					toggleHeader.subscribe('onCheckedChange', function(wsEvent, checked) {
						button.toggle(checked);
						toggleHeader.setCaption(checked ? 'СКРЫТЬ' : 'ПОКАЗАТЬ');
					});
				}
			}
		});

		return MyToggleHeader;
	}
);