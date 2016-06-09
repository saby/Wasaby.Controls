var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.RichFieldEditor', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/IntRichFieldEditor2.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .ws-editor-frame');
				this.input2 = find('[sbisname="FieldRichEditor 2"] .ws-editor-frame');
				this.textColor = find('[sbisname="FieldRichEditor 1"] [sbisname="textColor"] .custom-select-arrow')
				this.textAlign = find('[sbisname="FieldRichEditor 1"] [sbisname="justify"] .custom-select-arrow')
				this.textList = find('[sbisname="FieldRichEditor 1"] [sbisname="list"] .custom-select-arrow')
				this.textStyle = find('[sbisname="FieldRichEditor 1"] [sbisname="style"] .custom-select-arrow')
				this.toolbar = find('[sbisname="FieldRichEditor 1"] .ws-field-rich-editor-toolbar-toggle-button')
				this.bold = find('[sbisname="FieldRichEditor 1"] [sbisname="bold"]')
				this.italic = find('[sbisname="FieldRichEditor 1"] [sbisname="italic"]')
				this.underline = find('[sbisname="FieldRichEditor 1"] [sbisname="underline"]')
				this.strikethrough = find('[sbisname="FieldRichEditor 1"] [sbisname="strikethrough"]')
				this.addLink = find('[sbisname="FieldRichEditor 1"] [sbisname="link"]')
				this.linkInput = find('input[name="fre_link_href"]')
				this.ok = find('.ws-window-titlebar [type="button"] .controls-Button__text')
				actions.wait(1000);				
            })

            .capture('plain', function (actions) {
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('with_text', function (actions) {
				actions.sendKeys(this.input, 'tensor');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('with_smile', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').insertSmile('Devil');
                });
				actions.click(this.input2);
			})
			
			.capture('opened_color_menu', function (actions) {
				actions.mouseMove(this.textColor);
				actions.waitForElementToShow('.ws-fre-black', 2000);
				actions.waitForElementToShow('.ws-fre-grey', 2000);
			})
			
			.capture('opened_align_menu', function (actions) {
				actions.mouseMove(this.textAlign);
				actions.waitForElementToShow('.ws-fre__alignleft', 2000);
				actions.waitForElementToShow('.ws-fre__alignjustify', 2000);
			})
			
			.capture('opened_list_menu', function (actions) {
				actions.mouseMove(this.textList);
				actions.waitForElementToShow('.icon-ListMarked', 2000);
				actions.waitForElementToShow('.icon-ListNumbered', 2000);
			})
			
			.capture('opened_style_menu', function (actions) {
				actions.mouseMove(this.textStyle);
				actions.waitForElementToShow('.ws-fre__styleText-title', 2000);
				actions.waitForElementToShow('.ws-fre__styleText-additionalText', 2000);
			})
			
			.capture('hovered_style_button', function (actions) {
				actions.click(this.input2);
				actions.mouseMove(this.bold);
			})
			
			.capture('opened_add_link_dialog', function (actions) {
				actions.click(this.addLink);
				actions.waitForElementToShow('input[name="fre_link_href"]', 2000);
				actions.waitForElementToShow('.ws-window-titlebar-action.close', 2000);
			})

			.capture('with_link', function (actions) {
				actions.sendKeys(this.linkInput, 'http://yandex.ru/');
				actions.click(this.ok);
				actions.wait(1000);
			})				

			.capture('closed_toolbar', function (actions) {
				actions.click(this.toolbar);
				actions.wait(1000);
			})
			
			.capture('disabled', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').setEnabled(false);
                });
			})
			
			.capture('disabled_with_text', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').setValue('За Лардерон');
                });
			})
    });

	gemini.suite('styles', function (test) {

        test.setUrl('/IntRichFieldEditor2.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .ws-editor-frame');
				this.input2 = find('[sbisname="FieldRichEditor 2"] .ws-editor-frame');
				this.textColor = find('[sbisname="FieldRichEditor 1"] [sbisname="textColor"] .custom-select-arrow')
				this.textAlign = find('[sbisname="FieldRichEditor 1"] [sbisname="justify"] .custom-select-arrow')
				this.textList = find('[sbisname="FieldRichEditor 1"] [sbisname="list"] .custom-select-arrow')
				this.textStyle = find('[sbisname="FieldRichEditor 1"] [sbisname="style"] .custom-select-arrow')
				this.toolbar = find('[sbisname="FieldRichEditor 1"] .ws-field-rich-editor-toolbar-toggle-button')
				this.bold = find('[sbisname="FieldRichEditor 1"] [sbisname="bold"]')
				this.italic = find('[sbisname="FieldRichEditor 1"] [sbisname="italic"]')
				this.underline = find('[sbisname="FieldRichEditor 1"] [sbisname="underline"]')
				this.strikethrough = find('[sbisname="FieldRichEditor 1"] [sbisname="strikethrough"]')
				this.addLink = find('[sbisname="FieldRichEditor 1"] [sbisname="link"]')
				this.linkInput = find('input[name="fre_link_href"]')
				this.ok = find('.ws-window-titlebar [type="button"] .controls-Button__text')
				actions.wait(1000);				
            })

            .capture('bold', function (actions) {
				actions.sendKeys(this.input, 'tensor');
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.bold);
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('italic', function (actions) {
				actions.click(this.bold);
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.italic);
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('underline', function (actions) {
				actions.click(this.italic);
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.underline);
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('strikethrough', function (actions) {
				actions.click(this.underline);
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.strikethrough);
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('red', function (actions) {
				actions.click(this.strikethrough);
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textColor);
				actions.waitForElementToShow('.ws-fre-red', 2000);
				actions.click('.ws-fre-red');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('green', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textColor);
				actions.waitForElementToShow('.ws-fre-green', 2000);
				actions.click('.ws-fre-green');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('blue', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textColor);
				actions.waitForElementToShow('.ws-fre-blue', 2000);
				actions.click('.ws-fre-blue');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('purple', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textColor);
				actions.waitForElementToShow('.ws-fre-purple', 2000);
				actions.click('.ws-fre-purple');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('grey', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textColor);
				actions.waitForElementToShow('.ws-fre-grey', 2000);
				actions.click('.ws-fre-grey');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('black', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textColor);
				actions.waitForElementToShow('.ws-fre-black', 2000);
				actions.click('.ws-fre-black');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('title', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.textStyle);
				actions.waitForElementToShow('[dropdown-owner-name="style"] .ws-fre__styleText-title', 2000);
				actions.click('[dropdown-owner-name="style"] .ws-fre__styleText-title');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('sub_title', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.textStyle);
				actions.waitForElementToShow('[dropdown-owner-name="style"] .ws-fre__styleText-subTitle', 2000);
				actions.click('[dropdown-owner-name="style"] .ws-fre__styleText-subTitle');
				actions.sendKeys(this.input, gemini.TAB);
			})

			.capture('selected_main_text', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.textStyle);
				actions.waitForElementToShow('[dropdown-owner-name="style"] .ws-fre__styleText-selectedMainText', 2000);
				actions.click('[dropdown-owner-name="style"] .ws-fre__styleText-selectedMainText');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('additional_text', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.textStyle);
				actions.waitForElementToShow('[dropdown-owner-name="style"] .ws-fre__styleText-additionalText', 2000);
				actions.click('[dropdown-owner-name="style"] .ws-fre__styleText-additionalText');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('main_text', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.textStyle);
				actions.waitForElementToShow('[dropdown-owner-name="style"] .ws-fre__styleText-mainText', 2000);
				actions.click('[dropdown-owner-name="style"] .ws-fre__styleText-mainText');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('ordered', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'flow');
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.textList);
				actions.waitForElementToShow('[data-id="InsertOrderedList"]', 2000);
				actions.click('[data-id="InsertOrderedList"]');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('unordered', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.textList);
				actions.waitForElementToShow('[data-id="InsertUnorderedList"]', 2000);
				actions.click('[data-id="InsertUnorderedList"]');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('center', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.textAlign);
				actions.waitForElementToShow('.ws-fre__aligncenter', 2000);
				actions.click('.ws-fre__aligncenter');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('right', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.textAlign);
				actions.waitForElementToShow('.ws-fre__alignright', 2000);
				actions.click('.ws-fre__alignright');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('justify', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.textAlign);
				actions.waitForElementToShow('.ws-fre__alignjustify', 2000);
				actions.click('.ws-fre__alignjustify');
				actions.sendKeys(this.input, gemini.TAB);
			})
    });
	
	gemini.suite('delete_content', function (test) {

        test.setUrl('/IntRichFieldEditor2.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .ws-editor-frame');
				this.input2 = find('[sbisname="FieldRichEditor 2"] .ws-editor-frame');
				this.textColor = find('[sbisname="FieldRichEditor 1"] [sbisname="textColor"] .custom-select-arrow')
				this.textAlign = find('[sbisname="FieldRichEditor 1"] [sbisname="justify"] .custom-select-arrow')
				this.textList = find('[sbisname="FieldRichEditor 1"] [sbisname="list"] .custom-select-arrow')
				this.textStyle = find('[sbisname="FieldRichEditor 1"] [sbisname="style"] .custom-select-arrow')
				this.toolbar = find('[sbisname="FieldRichEditor 1"] .ws-field-rich-editor-toolbar-toggle-button')
				this.bold = find('[sbisname="FieldRichEditor 1"] [sbisname="bold"]')
				this.italic = find('[sbisname="FieldRichEditor 1"] [sbisname="italic"]')
				this.underline = find('[sbisname="FieldRichEditor 1"] [sbisname="underline"]')
				this.strikethrough = find('[sbisname="FieldRichEditor 1"] [sbisname="strikethrough"]')
				this.addLink = find('[sbisname="FieldRichEditor 1"] [sbisname="link"]')
				this.linkInput = find('input[name="fre_link_href"]')
				this.ok = find('.ws-window-titlebar [type="button"] .controls-Button__text')
				actions.wait(1000);				
            })
			
			.capture('with_text', function (actions) {
				actions.sendKeys(this.input, 'tensor');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('deleted_text', function (actions) {
				actions.click(this.input)
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.BACK_SPACE);
				actions.sendKeys(this.input, gemini.BACK_SPACE);
				actions.sendKeys(this.input, gemini.BACK_SPACE);
				actions.sendKeys(this.input, gemini.BACK_SPACE);
				actions.sendKeys(this.input, gemini.BACK_SPACE);
				actions.sendKeys(this.input, gemini.BACK_SPACE);
				actions.sendKeys(this.input, gemini.TAB);
			})		
    });
	
	gemini.suite('set_value', function (test) {

        test.setUrl('/IntRichFieldEditor2.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .ws-editor-frame');
				actions.wait(1000);				
            })
			
			.capture('disabled', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').setEnabled(false);
                });
			})
			
			.capture('set_value', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').setValue('123');
                });
			})

			.capture('set_value 2', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').setValue('<p>123</p>');
                });
			})
    });
});