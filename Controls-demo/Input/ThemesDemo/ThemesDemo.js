define('Controls-demo/Input/ThemesDemo/ThemesDemo', [
	'Core/Control',
	'tmpl!Controls-demo/Input/ThemesDemo/ThemesDemo',
	'Controls/Input/Text',
	'css!Controls-demo/Input/ThemesDemo/ThemesDemo'
], function ( Control, dotTplFn) {
	'use strict';
	var moduleClass = Control.extend({
		_template: dotTplFn
	});

	return moduleClass;
});