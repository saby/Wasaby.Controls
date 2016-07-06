var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.RichFieldEditor WS', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/IntRichFieldEditorWS2.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

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
				actions.wait(500);				
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
				actions.wait(500);
			})				

			.capture('closed_toolbar', function (actions) {
				actions.click(this.toolbar);
				actions.wait(500);
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

        test.setUrl('/IntRichFieldEditorWS2.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

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
				actions.wait(500);				
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
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('sub_title', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.textStyle);
				actions.waitForElementToShow('[dropdown-owner-name="style"] .ws-fre__styleText-subTitle', 2000);
				actions.click('[dropdown-owner-name="style"] .ws-fre__styleText-subTitle');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.TAB);
			})

			.capture('selected_main_text', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.textStyle);
				actions.waitForElementToShow('[dropdown-owner-name="style"] .ws-fre__styleText-selectedMainText', 2000);
				actions.click('[dropdown-owner-name="style"] .ws-fre__styleText-selectedMainText');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('additional_text', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.textStyle);
				actions.waitForElementToShow('[dropdown-owner-name="style"] .ws-fre__styleText-additionalText', 2000);
				actions.click('[dropdown-owner-name="style"] .ws-fre__styleText-additionalText');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('main_text', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.textStyle);
				actions.waitForElementToShow('[dropdown-owner-name="style"] .ws-fre__styleText-mainText', 2000);
				actions.click('[dropdown-owner-name="style"] .ws-fre__styleText-mainText');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
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

        test.setUrl('/IntRichFieldEditorWS14.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .ws-editor-frame');
				actions.wait(500);				
            })
			
			.capture('with_text', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, 'tensor');
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'flow');
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'magnus');
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'kennen');
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'dota 2');
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'warcraft');
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'batman');
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.ARROW_LEFT);
			})
			
			.capture('selected_text', function (actions) {
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
			})
			
			.capture('deleted_text', function (actions) {
				actions.sendKeys(this.input, gemini.BACK_SPACE);
				actions.sendKeys(this.input, gemini.TAB);
			})		
    });
	
	gemini.suite('set_value', function (test) {

        test.setUrl('/IntRichFieldEditorWS2.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .ws-editor-frame');
				actions.wait(500);				
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
	
	gemini.suite('tiny_in_tiny', function (test) {

        test.setUrl('/IntRichFieldEditorWS8.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .ws-editor-frame');
				actions.wait(500);				
            })

            .capture('plain')		
    });
	
	gemini.suite('null_in_context', function (test) {

        test.setUrl('/IntRichFieldEditorWS9.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .ws-editor-frame');
				actions.wait(500);
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').setEnabled(false);
                });				
            })

            .capture('plain')		
    });
	
	gemini.suite('image_resize', function (test) {

        test.setUrl('/IntRichFieldEditorWS12.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .ws-editor-frame');
				this.image = find('[sbisname="FieldRichEditor 1"] .ws-editor-frame img');
				this.height = find('input[name="imageHeight"]');
				this.apply = find('[sbisname="applyButton"] .ws-button-caption');
				this.menu = find('[data-lmtype="Dialog"] .ws-field-dropdown-simple .custom-select-text')
				actions.wait(2000);				
            })

            .capture('plain')

			.capture('opened_resize_menu_dialog', function (actions) {
				actions.executeJS(function (window) {
                    window.$('[sbisname="FieldRichEditor 1"] .ws-editor-frame img').dblclick();
                });	
				actions.waitForElementToShow('input[name="imageHeight"]', 2000);				
				actions.sendKeys(this.height, gemini.ARROW_RIGHT);
				actions.sendKeys(this.height, gemini.SHIFT+gemini.HOME);
				actions.sendKeys(this.height, '56');
				actions.sendKeys(this.height, gemini.SHIFT+gemini.HOME);
			})
			
			.capture('opened_size_menu_dialog', function (actions) {
				actions.click(this.menu)
				actions.wait(500);				
			})
			
			.capture('resized', function (actions) {
				actions.click(this.apply)
				actions.wait(500);				
				actions.click(this.image)
			})
    });
	
	gemini.suite('with_closed_toolbar', function (test) {

        test.setUrl('/IntRichFieldEditorWS11.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .ws-editor-frame');
				actions.wait(2000);				
            })

			.capture('with_text', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, 'tensor\nflow');
				actions.sendKeys(this.input, gemini.SHIFT+gemini.HOME);
			})
			
			.capture('disabled', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').setEnabled(false);
                });	
			})
    });
	
	gemini.suite('toolbar_after_enebled', function (test) {

        test.setUrl('/IntRichFieldEditorWS10.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				actions.wait(2000);				
            })

			.capture('plain')
			
			.capture('enabled', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').setEnabled(true);
                });	
				actions.wait(2000);
			})
    });
	
	gemini.suite('toggle_toolbar', function (test) {

        test.setUrl('/IntRichFieldEditorWS.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .ws-editor-frame');
				this.toolbar = find('.ws-field-rich-editor-toolbar-toggle-button');
				actions.wait(2000);				
            })

			.capture('plain', function (actions) {
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('closed', function (actions) {
				actions.click(this.toolbar);
				actions.wait(1000);
			})
    });
	
	gemini.suite('selection_on_toggle_toolbar', function (test) {

        test.setUrl('/IntRichFieldEditorWS.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .ws-editor-frame');
				this.toolbar = find('.ws-field-rich-editor-toolbar-toggle-button');
				actions.wait(2000);				
            })

			.capture('with_selection', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, 'tensor');
				actions.sendKeys(this.input, gemini.HOME);		
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);				
				actions.sendKeys(this.input, gemini.SHIFT+gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.SHIFT+gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.SHIFT+gemini.ARROW_RIGHT);
			})
			
			.capture('toggle_toolbar', function (actions) {
				actions.click(this.toolbar);
				actions.wait(1000);
			})
			
			.capture('without_selection', function (actions) {
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);				
			})
			
			.capture('toggle_toolbar_again', function (actions) {
				actions.click(this.toolbar);
				actions.wait(1000);
			})
    });
	
	gemini.suite('image_resize_2', function (test) {

        test.setUrl('/IntRichFieldEditorWS13.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .ws-editor-frame');
				this.image = find('[sbisname="FieldRichEditor 1"] .ws-editor-frame img');
				this.height = find('input[name="imageHeight"]');
				this.apply = find('[sbisname="applyButton"] .ws-button-caption');
				this.menu = find('[data-lmtype="Dialog"] .ws-field-dropdown-simple .custom-select-text')
				actions.wait(2000);				
            })

			.capture('resized', function (actions) {
				actions.click(this.image)
				actions.wait(500);				
			})
    });
	
	gemini.suite('with_closed_toolbar_2', function (test) {

        test.setUrl('/IntRichFieldEditorWS15.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .ws-editor-frame');
				this.textColor = find('[sbisname="FieldRichEditor 1"] [sbisname="textColor"] .custom-select-arrow')
				this.textAlign = find('[sbisname="FieldRichEditor 1"] [sbisname="justify"] .custom-select-arrow')
				this.textList = find('[sbisname="FieldRichEditor 1"] [sbisname="list"] .custom-select-arrow')
				this.textStyle = find('[sbisname="FieldRichEditor 1"] [sbisname="style"] .custom-select-arrow')
				this.toolbar = find('[sbisname="FieldRichEditor 1"] .ws-field-rich-editor-toolbar-toggle-button')
				this.bold = find('[sbisname="FieldRichEditor 1"] [sbisname="bold"]')
				this.italic = find('[sbisname="FieldRichEditor 1"] [sbisname="italic"]')
				this.underline = find('[sbisname="FieldRichEditor 1"] [sbisname="underline"]')
				this.strikethrough = find('[sbisname="FieldRichEditor 1"] [sbisname="strikethrough"]')
				this.toolbar = find('.ws-field-rich-editor-toolbar-toggle-button');
				actions.wait(2000);				
            })

			.capture('with_text', function (actions) {
				actions.click(this.toolbar);
				actions.click(this.input);
				actions.sendKeys(this.input, 'Заголовок');
				actions.sendKeys(this.input, gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.textStyle);
				actions.waitForElementToShow('[dropdown-owner-name="style"] .ws-fre__styleText-title', 2000);
				actions.click('[dropdown-owner-name="style"] .ws-fre__styleText-title');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'Подзаголовок');
				actions.sendKeys(this.input, gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.textStyle);
				actions.waitForElementToShow('[dropdown-owner-name="style"] .ws-fre__styleText-subTitle', 2000);
				actions.click('[dropdown-owner-name="style"] .ws-fre__styleText-subTitle');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'Выделенный основной');
				actions.sendKeys(this.input, gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.textStyle);
				actions.waitForElementToShow('[dropdown-owner-name="style"] .ws-fre__styleText-selectedMainText', 2000);
				actions.click('[dropdown-owner-name="style"] .ws-fre__styleText-selectedMainText');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'Дополнительный текст');
				actions.sendKeys(this.input, gemini.SHIFT+gemini.HOME);
				actions.mouseMove(this.textStyle);
				actions.waitForElementToShow('[dropdown-owner-name="style"] .ws-fre__styleText-additionalText', 2000);
				actions.click('[dropdown-owner-name="style"] .ws-fre__styleText-additionalText');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.click(this.bold)
				actions.sendKeys(this.input, 'Жирный');
				actions.click(this.bold)
				actions.click(this.italic)
				actions.sendKeys(this.input, 'Курсив');
				actions.click(this.italic)
				actions.click(this.underline)
				actions.sendKeys(this.input, 'Подчеркнутый');
				actions.click(this.underline)
				actions.click(this.strikethrough)
				actions.sendKeys(this.input, 'Зачеркнутый');
				actions.click(this.strikethrough)
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'слева');
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'по середине');
				actions.mouseMove(this.textAlign);
				actions.waitForElementToShow('.ws-fre__aligncenter', 2000);
				actions.click('.ws-fre__aligncenter');
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'справа');
				actions.mouseMove(this.textAlign);
				actions.waitForElementToShow('.ws-fre__alignright', 2000);
				actions.click('.ws-fre__alignright');
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'по ширине');
				actions.mouseMove(this.textAlign);
				actions.waitForElementToShow('.ws-fre__alignjustify', 2000);
				actions.click('.ws-fre__alignjustify');
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'список с точками');
				actions.mouseMove(this.textList);
				actions.waitForElementToShow('[data-id="InsertUnorderedList"]', 2000);
				actions.click('[data-id="InsertUnorderedList"]');
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, gemini.SHIFT+gemini.HOME);
				actions.sendKeys(this.input, 'список с цифрами');
				actions.mouseMove(this.textList);
				actions.waitForElementToShow('[data-id="InsertOrderedList"]', 2000);
				actions.click('[data-id="InsertOrderedList"]');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').insertSmile('Devil');
                });
				actions.sendKeys(this.input, ' смайлик ');
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').insertSmile('Devil');
                });
				actions.click(this.toolbar);
				actions.sendKeys(this.input, gemini.TAB);
				actions.wait(1000);
			})

			.capture('disabled', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').setEnabled(false);
                });	
			})
    });
});