var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.RichFieldEditor', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/IntRichFieldEditor2.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame');
				this.input2 = find('[sbisname="FieldRichEditor 2"] .controls-RichEditor__editorFrame');
				this.textColor = find('[sbisname="FieldRichEditor 1"] [sbisname="color"]')
				this.textAlign = find('[sbisname="FieldRichEditor 1"] [sbisname="align"]')
				this.textList = find('[sbisname="FieldRichEditor 1"] [sbisname="list"]')
				this.textStyle = find('[sbisname="FieldRichEditor 1"] [sbisname="style"]')
				this.toolbar = find('[sbisname="FieldRichEditor 1"] .controls-RichEditorToolbar__toggleButton')
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
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').insertSmile('first');
                });
				actions.click(this.input2);
			})
			
			.capture('opened_color_menu', function (actions) {
				actions.click(this.textColor);
				actions.waitForElementToShow('.controls-RichEditorToolbar__colorBlack', 2000);
				actions.waitForElementToShow('.controls-RichEditorToolbar__colorGrey', 2000);
			})
			
			.capture('opened_align_menu', function (actions) {
				actions.click(this.textAlign);
				actions.waitForElementToShow('.icon-AlignmentLeft', 2000);
				actions.waitForElementToShow('.icon-AlignmentWidth', 2000);
			})
			
			.capture('opened_list_menu', function (actions) {
				actions.click(this.textList);
				actions.waitForElementToShow('.icon-ListMarked', 2000);
				actions.waitForElementToShow('.icon-ListNumbered', 2000);
			})
			
			.capture('opened_style_menu', function (actions) {
				actions.click(this.textStyle);
				actions.waitForElementToShow('.controls-RichEditorDropdown__itemText__title', 2000);
				actions.waitForElementToShow('.controls-RichEditorDropdown__itemText__additionalText', 2000);
			})
			
			.capture('hovered_style_button', function (actions) {
				actions.click(this.input2);
				actions.mouseMove(this.bold);
			})
			
			.capture('opened_add_link_dialog', function (actions) {
				actions.click(this.addLink);
				actions.waitForElementToShow('input[name="fre_link_href"]', 2000);
				actions.waitForElementToShow('.ws-window-titlebar-action.close', 2000);
				actions.sendKeys(this.linkInput, 'http://yandex.ru/');
				actions.sendKeys(this.linkInput, gemini.SHIFT+gemini.CONTROL+gemini.ARROW_LEFT);
			})

			.capture('with_link', function (actions) {
				actions.click(this.ok);
				actions.wait(500);
			})				

			.capture('closed_toolbar', function (actions) {
				actions.click(this.toolbar);
				actions.click(this.input2);
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

        test.setUrl('/IntRichFieldEditor2.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame');
				this.input2 = find('[sbisname="FieldRichEditor 2"] .controls-RichEditor__editorFrame');
				this.textColor = find('[sbisname="FieldRichEditor 1"] [sbisname="color"]')
				this.textAlign = find('[sbisname="FieldRichEditor 1"] [sbisname="align"]')
				this.textList = find('[sbisname="FieldRichEditor 1"] [sbisname="list"]')
				this.textStyle = find('[sbisname="FieldRichEditor 1"] [sbisname="style"]')
				this.toolbar = find('[sbisname="FieldRichEditor 1"] .controls-RichEditorToolbar__toggleButton')
				this.bold = find('[sbisname="FieldRichEditor 1"] [sbisname="bold"]')
				this.italic = find('[sbisname="FieldRichEditor 1"] [sbisname="italic"]')
				this.underline = find('[sbisname="FieldRichEditor 1"] [sbisname="underline"]')
				this.strikethrough = find('[sbisname="FieldRichEditor 1"] [sbisname="strikethrough"]')
				this.addLink = find('[sbisname="FieldRichEditor 1"] [sbisname="link"]')
				this.linkInput = find('input[name="fre_link_href"]')
				this.ok = find('.ws-window-titlebar [type="button"] .controls-Button__text')
				this.wrap = find('[sbisname="Button 1"]');
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
				actions.waitForElementToShow('.controls-RichEditorToolbar__colorRed', 2000);
				actions.click('.controls-RichEditorToolbar__colorRed');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('green', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textColor);
				actions.waitForElementToShow('.controls-RichEditorToolbar__colorGreen', 2000);
				actions.click('.controls-RichEditorToolbar__colorGreen');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('blue', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textColor);
				actions.waitForElementToShow('.controls-RichEditorToolbar__colorBlue', 2000);
				actions.click('.controls-RichEditorToolbar__colorBlue');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('purple', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textColor);
				actions.waitForElementToShow('.controls-RichEditorToolbar__colorPurple', 2000);
				actions.click('.controls-RichEditorToolbar__colorPurple');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('grey', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textColor);
				actions.waitForElementToShow('.controls-RichEditorToolbar__colorGrey', 2000);
				actions.click('.controls-RichEditorToolbar__colorGrey');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('black', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textColor);
				actions.waitForElementToShow('.controls-RichEditorToolbar__colorBlack', 2000);
				actions.click('.controls-RichEditorToolbar__colorBlack');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('title', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textStyle);
				actions.waitForElementToShow('.controls-RichEditorDropdown__itemText__title', 2000);
				actions.click('.controls-RichEditorDropdown__itemText__title');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('sub_title', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textStyle);
				actions.waitForElementToShow('.controls-RichEditorDropdown__itemText__subTitle', 2000);
				actions.click('.controls-RichEditorDropdown__itemText__subTitle');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.TAB);
			})

			.capture('selected_main_text', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textStyle);
				actions.waitForElementToShow('.controls-RichEditorDropdown__itemText__selectedMainText', 2000);
				actions.click('.controls-RichEditorDropdown__itemText__selectedMainText');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('additional_text', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textStyle);
				actions.waitForElementToShow('.controls-RichEditorDropdown__itemText__additionalText', 2000);
				actions.click('.controls-RichEditorDropdown__itemText__additionalText');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('ordered', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'flow');
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textList);
				actions.waitForElementToShow('[data-id="InsertOrderedList"]', 2000);
				actions.click('[data-id="InsertOrderedList"]');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('unordered', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textList);
				actions.waitForElementToShow('[data-id="InsertUnorderedList"]', 2000);
				actions.click('[data-id="InsertUnorderedList"]');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('center', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textAlign);
				actions.waitForElementToShow('.icon-AlignmentCenter', 2000);
				actions.click('.icon-AlignmentCenter');
				actions.click(this.wrap);
				actions.click(this.input2);
			})
			
			.capture('right', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textAlign);
				actions.waitForElementToShow('.icon-AlignmentRight', 2000);
				actions.click('.icon-AlignmentRight');
				actions.click(this.wrap);
				actions.click(this.input2);
			})
			
			.capture('justify', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textAlign);
				actions.waitForElementToShow('.icon-AlignmentWidth', 2000);
				actions.click('.icon-AlignmentWidth');
				actions.click(this.wrap);
				actions.click(this.input2);
			})
    });

	gemini.suite('delete_content', function (test) {

        test.setUrl('/IntRichFieldEditor14.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame');
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

        test.setUrl('/IntRichFieldEditor2.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame');
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

        test.setUrl('/IntRichFieldEditor8.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame');
				actions.wait(500);				
            })

            .capture('plain')		
    });
	
	gemini.suite('null_in_context', function (test) {

        test.setUrl('/IntRichFieldEditor9.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame');
				actions.wait(500);
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').setEnabled(false);
                });				
            })

            .capture('plain')		
    });

	gemini.suite('image_resize', function (test) {

        test.setUrl('/IntRichFieldEditor12.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame');
				this.image = find('[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame img');
				this.height = find('input[name="imageHeight"]');
				this.apply = find('[sbisname="applyButton"] .ws-button-caption');
				this.menu = find('[data-lmtype="Dialog"] .ws-field-dropdown-simple .custom-select-text')
				actions.wait(2000);				
            })

            .capture('plain')

			.capture('opened_resize_menu_dialog', function (actions) {
				actions.executeJS(function (window) {
                    window.$('[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame img').dblclick();
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

        test.setUrl('/IntRichFieldEditor11.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame');
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

        test.setUrl('/IntRichFieldEditor10.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

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
			
			.capture('hovered_toolbar', function (actions) {
				actions.mouseMove('.controls-RichEditorToolbar__toggleButton');	
			})
			
			.capture('hovered_button', function (actions) {
				actions.mouseMove('[sbisname="bold"]');	
			})
			
			.capture('hovered_style_button', function (actions) {
				actions.mouseMove('[sbisname="style"]');
			})
    });
	
	gemini.suite('toggle_toolbar', function (test) {

        test.setUrl('/IntRichFieldEditor.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame');
				this.toolbar = find('.controls-RichEditorToolbar__toggleButton');
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

        test.setUrl('/IntRichFieldEditor.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame');
				this.toolbar = find('.controls-RichEditorToolbar__toggleButton');
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

        test.setUrl('/IntRichFieldEditor13.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame');
				this.image = find('[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame img');
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

        test.setUrl('/IntRichFieldEditor15.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame');
				this.textColor = find('[sbisname="FieldRichEditor 1"] [sbisname="color"]')
				this.textAlign = find('[sbisname="FieldRichEditor 1"] [sbisname="align"]')
				this.textList = find('[sbisname="FieldRichEditor 1"] [sbisname="list"]')
				this.textStyle = find('[sbisname="FieldRichEditor 1"] [sbisname="style"]')
				this.toolbar = find('[sbisname="FieldRichEditor 1"] .controls-RichEditorToolbar__toggleButton')
				this.bold = find('[sbisname="FieldRichEditor 1"] [sbisname="bold"]')
				this.italic = find('[sbisname="FieldRichEditor 1"] [sbisname="italic"]')
				this.underline = find('[sbisname="FieldRichEditor 1"] [sbisname="underline"]')
				this.strikethrough = find('[sbisname="FieldRichEditor 1"] [sbisname="strikethrough"]')
				this.toolbar = find('.controls-RichEditorToolbar__toggleButton');
				actions.wait(2000);				
            })

			.capture('with_text', function (actions) {
				actions.click(this.toolbar);
				actions.click(this.input);
				actions.sendKeys(this.input, 'Заголовок');
				actions.sendKeys(this.input, gemini.SHIFT+gemini.HOME);
				actions.click(this.textStyle);
				actions.waitForElementToShow('.controls-RichEditorDropdown__itemText__title', 2000);
				actions.click('.controls-RichEditorDropdown__itemText__title');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'Подзаголовок');
				actions.sendKeys(this.input, gemini.SHIFT+gemini.HOME);
				actions.click(this.textStyle);
				actions.waitForElementToShow('.controls-RichEditorDropdown__itemText__subTitle', 2000);
				actions.click('.controls-RichEditorDropdown__itemText__subTitle');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'Выделенный основной');
				actions.sendKeys(this.input, gemini.SHIFT+gemini.HOME);
				actions.click(this.textStyle);
				actions.waitForElementToShow('.controls-RichEditorDropdown__itemText__selectedMainText', 2000);
				actions.click('.controls-RichEditorDropdown__itemText__selectedMainText');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'Дополнительный текст');
				actions.sendKeys(this.input, gemini.SHIFT+gemini.HOME);
				actions.click(this.textStyle);
				actions.waitForElementToShow('.controls-RichEditorDropdown__itemText__additionalText', 2000);
				actions.click('.controls-RichEditorDropdown__itemText__additionalText');
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
				actions.click(this.textAlign);
				actions.waitForElementToShow('.icon-AlignmentCenter', 2000);
				actions.click('.icon-AlignmentCenter');
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'справа');
				actions.click(this.textAlign);
				actions.waitForElementToShow('.icon-AlignmentRight', 2000);
				actions.click('.icon-AlignmentRight');
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'по ширине');
				actions.click(this.textAlign);
				actions.waitForElementToShow('.icon-AlignmentWidth', 2000);
				actions.click('.icon-AlignmentWidth');
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'список с точками');
				actions.click(this.textList);
				actions.waitForElementToShow('[data-id="InsertUnorderedList"]', 2000);
				actions.click('[data-id="InsertUnorderedList"]');
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, gemini.SHIFT+gemini.HOME);
				actions.sendKeys(this.input, 'список с цифрами');
				actions.click(this.textList);
				actions.waitForElementToShow('[data-id="InsertOrderedList"]', 2000);
				actions.click('[data-id="InsertOrderedList"]');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').insertSmile('first');
                });
				actions.sendKeys(this.input, ' смайлик ');
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').insertSmile('first');
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
	
	gemini.suite('surounded_editors', function (test) {

        test.setUrl('/IntRichFieldEditor16.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame');
				this.input2 = find('[sbisname="FieldRichEditor 2"] .controls-RichEditor__editorFrame');
				this.input3 = find('[sbisname="FieldRichEditor 3"] .controls-RichEditor__editorFrame');
				actions.wait(500);				
            })

            .capture('plain')
			
			.capture('with_text', function (actions) {
				actions.click(this.input)
				actions.sendKeys(this.input, 'tensor\nflow');
				actions.sendKeys(this.input, gemini.SHIFT+gemini.ARROW_LEFT);
			})
			
			.capture('with_smile', function (actions) {
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').insertSmile('first');
                });
				actions.sendKeys(this.input, gemini.ARROW_UP);
				actions.sendKeys(this.input, gemini.SHIFT+gemini.ARROW_LEFT);
			})
			
			.capture('disabled', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').setEnabled(false);
                });
			})			
    });

    gemini.suite('smile_menu', function (test) {

        test.setUrl('/IntRichFieldEditor19.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame');
				actions.waitForElementToShow('[sbisname="smile"]', 40000);
				this.smile_menu = find('[sbisname="smile"]');
				actions.wait(500);
            })

			.capture('opened_smile_menu', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, 'tensor\nflow');
				actions.sendKeys(this.input, gemini.SHIFT+gemini.ARROW_LEFT);
				actions.click(this.smile_menu);
			})
    });

	gemini.suite('decorate_link', function (test) {

        test.setUrl('/IntRichFieldEditor47.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[id="1"]', 40000);
				actions.waitForElementToShow('[id="5"]', 5000);
				actions.waitForElementToShow('[id="6"]', 5000);
				actions.waitForElementToShow('[id="9"]', 5000);
            })

			.capture('plain')
    });
    /*
	gemini.suite('decorate_link_then_disabled', function (test) {

        test.setUrl('/IntRichFieldEditor48.html').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = find('[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame');
				this.focus = find('[sbisname="TextBox 1"] input');
				actions.wait(500);				
            })
			
			.capture('plain', function (actions) {
				actions.click(this.focus);
				actions.sendKeys(this.focus, 'http://ogp.me');
				actions.sendKeys(this.focus, gemini.ARROW_RIGHT);
				actions.sendKeys(this.focus, gemini.SHIFT+gemini.HOME);
				actions.sendKeys(this.focus, gemini.CONTROL+gemini.INSERT);
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.SHIFT+gemini.INSERT);
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').setEnabled(false);
                });
				actions.waitForElementToShow('.engine-DecoratedLink', 5000);
			})	
    });*/
	
	gemini.suite('rich_text_area', function (test) {

        test.setUrl('/IntRichFieldEditor44.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="RichEditorRoundToolbar"]', 40000);
				actions.waitForElementToShow('[sbisname="RichTextArea"]', 5000);
				this.toggle = '[sbisname="toggle"]';
				this.input = '.controls-RichEditor__editorFrame';
				this.link = '[sbisname="link"]';
				this.link_input = 'input.input-string-field';
				actions.wait(500);				
            })
			
			.capture('plain', function (actions) {
				actions.click(this.toggle);
				actions.waitForElementToShow(this.link, 5000);
				actions.wait(100);				
				actions.click(this.link);
				actions.waitForElementToShow(this.link_input, 5000);
				actions.sendKeys(this.link_input, 'tensor');
				actions.sendKeys(this.link_input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.link_input, gemini.SHIFT+gemini.HOME);
			})	
    });
});