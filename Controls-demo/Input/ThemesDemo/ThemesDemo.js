define('Controls-demo/Input/ThemesDemo/ThemesDemo', [
	'Core/Control',
	'wml!Controls-demo/Input/ThemesDemo/ThemesDemo',
	'Controls/Input/Text'
], function ( Control, dotTplFn) {
	'use strict';
	var moduleClass = Control.extend({
		_template: dotTplFn,

		_text1: 'Поле ввода текста',
		_number1: '123456',
		_area1: 'Многострочное поле ввода size m',
		_area2: 'Многострочное поле ввода size l'
	});

	return moduleClass;
});