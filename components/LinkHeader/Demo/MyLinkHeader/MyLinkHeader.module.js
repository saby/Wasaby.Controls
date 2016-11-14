define('js!SBIS3.CONTROLS.Demo.MyLinkHeader',
	[
		'js!SBIS3.CONTROLS.CompoundControl',
		'tmpl!SBIS3.CONTROLS.Demo.MyLinkHeader',
		'js!SBIS3.CONTROLS.LinkHeader'
	],
	function(CompoundControl, dotTplFn) {

		'use strict';

		var MyLinkHeader = CompoundControl.extend({
			_dotTplFn: dotTplFn
		});

		return MyLinkHeader;
	}
);