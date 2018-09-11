define('Controls-demo/Input/DeprecatedArea/AreaVdom', [
	'Core/Control',
	'wml!Controls-demo/Input/DeprecatedArea/AreaVdom',
	'Controls/Input/Area',
	'css!Controls-demo/Input/DeprecatedArea/AreaVdom'
], function ( Control, dotTplFn) {
	'use strict';
	var moduleClass = Control.extend({
		
		_template: dotTplFn,
		
		_minLines1: 2, _area1: '',
		_minLines2: 2, _area2: '1234567890123456789012345678901234567890123456789123456789012345678901234567890123',
		_maxLines3: 3, _area3: '',
		_maxLines4: 3, _area4: '1234567890123456789012345678901234567890123456789123456789012345678901234567890123',
		_minLines5: 2, _maxLines5: 3, _area5: '',
		_minLines6: 2, _maxLines6: 3, _area6: '1234567890123456789012345678901234567890123456789123456789012345678901234567890123'
		
	});

	return moduleClass;
});