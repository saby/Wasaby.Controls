gemini.suite('SBIS3.CONTROLS.RichFieldEditor', function () {
	
    gemini.suite('base', function (test) {

        test.setUrl('/IntRichFieldEditor2.html').skip('chrome').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = '[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame';
				this.input2 = '[sbisname="FieldRichEditor 2"] .controls-RichEditor__editorFrame';
				this.textColor = '[sbisname="FieldRichEditor 1"] [sbisname="color"]'
				this.textAlign = '[sbisname="FieldRichEditor 1"] [sbisname="align"]'
				this.textList = '[sbisname="FieldRichEditor 1"] [sbisname="list"]'
				this.textStyle = '[sbisname="FieldRichEditor 1"] [sbisname="style"]'
				this.toolbar = '[sbisname="FieldRichEditor 1"] .controls-RichEditorToolbar__toggleButton'
				this.bold = '[sbisname="FieldRichEditor 1"] [sbisname="bold"]'
				this.italic = '[sbisname="FieldRichEditor 1"] [sbisname="italic"]'
				this.underline = '[sbisname="FieldRichEditor 1"] [sbisname="underline"]'
				this.strikethrough = '[sbisname="FieldRichEditor 1"] [sbisname="strikethrough"]'
				this.addLink = '[sbisname="FieldRichEditor 1"] [sbisname="link"]'
				this.linkInput = 'input[name="fre_link_href"]'
				this.ok = '.ws-window-titlebar [type="button"] .controls-Button__text'
            })

            .capture('plain', function (actions) {
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('with_text', function (actions) {
				actions.sendKeys(this.input, 'tensor');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('opened_color_menu', function (actions) {
				actions.click(this.textColor);
				actions.waitForElementToShow('.controls-RichEditorToolbar__colorBlack', 5000);
				actions.waitForElementToShow('.controls-RichEditorToolbar__colorGrey', 5000);
			})
			
			.capture('opened_align_menu', function (actions) {
				actions.click(this.textAlign);
				actions.waitForElementToShow('.icon-AlignmentLeft', 5000);
				actions.waitForElementToShow('.icon-AlignmentWidth', 5000);
			})
			
			.capture('opened_list_menu', function (actions) {
				actions.click(this.textList);
				actions.waitForElementToShow('.icon-ListMarked', 5000);
				actions.waitForElementToShow('.icon-ListNumbered', 5000);
			})
			
			.capture('opened_style_menu', function (actions) {
				actions.click(this.textStyle);
				actions.waitForElementToShow('.controls-RichEditorDropdown__itemText__title', 5000);
				actions.waitForElementToShow('.controls-RichEditorDropdown__itemText__additionalText', 5000);
			})
			
			.capture('hovered_style_button', function (actions) {
				actions.click(this.input2);
				actions.mouseMove(this.bold);
			})
			
			.capture('opened_add_link_dialog', function (actions) {
				actions.click(this.addLink);
				actions.waitForElementToShow('input[name="fre_link_href"]', 5000);
				actions.waitForElementToShow('.ws-window-titlebar-action.close', 5000);
				actions.sendKeys(this.linkInput, 'http://yandex.ru/');
				actions.sendKeys(this.linkInput, gemini.SHIFT+gemini.CONTROL+gemini.ARROW_LEFT);
			})

			.capture('with_link', function (actions) {
				actions.click(this.ok);
			})				

			.capture('closed_toolbar', function (actions) {
				actions.click(this.toolbar);
				actions.wait(500);
				actions.click(this.input2);
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

        test.setUrl('/IntRichFieldEditor2.html').skip('chrome').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = '[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame';
				this.input2 = '[sbisname="FieldRichEditor 2"] .controls-RichEditor__editorFrame';
				this.textColor = '[sbisname="FieldRichEditor 1"] [sbisname="color"]'
				this.textAlign = '[sbisname="FieldRichEditor 1"] [sbisname="align"]'
				this.textList = '[sbisname="FieldRichEditor 1"] [sbisname="list"]'
				this.textStyle = '[sbisname="FieldRichEditor 1"] [sbisname="style"]'
				this.toolbar = '[sbisname="FieldRichEditor 1"] .controls-RichEditorToolbar__toggleButton'
				this.bold = '[sbisname="FieldRichEditor 1"] [sbisname="bold"]'
				this.italic = '[sbisname="FieldRichEditor 1"] [sbisname="italic"]'
				this.underline = '[sbisname="FieldRichEditor 1"] [sbisname="underline"]'
				this.strikethrough = '[sbisname="FieldRichEditor 1"] [sbisname="strikethrough"]'
				this.addLink = '[sbisname="FieldRichEditor 1"] [sbisname="link"]'
				this.linkInput = 'input[name="fre_link_href"]'
				this.ok = '.ws-window-titlebar [type="button"] .controls-Button__text'
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
				actions.waitForElementToShow('.controls-RichEditorToolbar__colorRed', 5000);
				actions.click('.controls-RichEditorToolbar__colorRed');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('green', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textColor);
				actions.waitForElementToShow('.controls-RichEditorToolbar__colorGreen', 5000);
				actions.click('.controls-RichEditorToolbar__colorGreen');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('blue', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textColor);
				actions.waitForElementToShow('.controls-RichEditorToolbar__colorBlue', 5000);
				actions.click('.controls-RichEditorToolbar__colorBlue');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('purple', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textColor);
				actions.waitForElementToShow('.controls-RichEditorToolbar__colorPurple', 5000);
				actions.click('.controls-RichEditorToolbar__colorPurple');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('grey', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textColor);
				actions.waitForElementToShow('.controls-RichEditorToolbar__colorGrey', 5000);
				actions.click('.controls-RichEditorToolbar__colorGrey');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('black', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textColor);
				actions.waitForElementToShow('.controls-RichEditorToolbar__colorBlack', 5000);
				actions.click('.controls-RichEditorToolbar__colorBlack');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('title', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textStyle);
				actions.waitForElementToShow('.controls-RichEditorDropdown__itemText__title', 5000);
				actions.click('.controls-RichEditorDropdown__itemText__title');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('sub_title', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textStyle);
				actions.waitForElementToShow('.controls-RichEditorDropdown__itemText__subTitle', 5000);
				actions.click('.controls-RichEditorDropdown__itemText__subTitle');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.TAB);
			})

			.capture('selected_main_text', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textStyle);
				actions.waitForElementToShow('.controls-RichEditorDropdown__itemText__selectedMainText', 5000);
				actions.click('.controls-RichEditorDropdown__itemText__selectedMainText');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('additional_text', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textStyle);
				actions.waitForElementToShow('.controls-RichEditorDropdown__itemText__additionalText', 5000);
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
				actions.waitForElementToShow('[data-id="InsertOrderedList"]', 5000);
				actions.click('[data-id="InsertOrderedList"]');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('unordered', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textList);
				actions.waitForElementToShow('[data-id="InsertUnorderedList"]', 5000);
				actions.click('[data-id="InsertUnorderedList"]');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('center', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textAlign);
				actions.waitForElementToShow('.icon-AlignmentCenter', 5000);
				actions.click('.icon-AlignmentCenter');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('right', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textAlign);
				actions.waitForElementToShow('.icon-AlignmentRight', 5000);
				actions.click('.icon-AlignmentRight');
				actions.sendKeys(this.input, gemini.TAB);
			})
			
			.capture('justify', function (actions) {
				actions.click(this.input);
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.HOME);
				actions.click(this.textAlign);
				actions.waitForElementToShow('.icon-AlignmentWidth', 5000);
				actions.click('.icon-AlignmentWidth');
				actions.sendKeys(this.input, gemini.TAB);
			})
    });
	
	gemini.suite('delete_content', function (test) {

        test.setUrl('/IntRichFieldEditor14.html').skip('chrome').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions) {
				
				this.editor = '[sbisname="FieldRichEditor 1"]';
				this.input = '[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame';
                
				actions.waitForElementToShow(this.editor, 40000);
				actions.waitForElementToShow(this.input, 5000);
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
			})		
    });
	
	gemini.suite('set_value', function (test) {

        test.setUrl('/IntRichFieldEditor2.html').skip('chrome').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = '[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame';
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

            .before(function (actions) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = '[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame';
            })

            .capture('plain')		
    });
	
	gemini.suite('null_in_context', function (test) {

        test.setUrl('/IntRichFieldEditor9.html').skip('chrome').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = '[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame';
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').setEnabled(false);
                });				
            })

            .capture('plain')		
    });
	
	gemini.suite('image_resize', function (test) {

        test.setUrl('/IntRichFieldEditor12.html').skip('chrome').setCaptureElements('html')

            .before(function (actions) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = '[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame';
				this.image = '[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame img';
				this.height = 'input[name="imageHeight"]';
				this.apply = '[sbisname="applyButton"] .ws-button-caption';
				this.menu = '[data-lmtype="Dialog"] .ws-field-dropdown-simple .custom-select-text'
				actions.wait(500);				
            })

            .capture('plain')

			.capture('opened_resize_menu_dialog', function (actions) {
				actions.executeJS(function (window) {
                    window.$('[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame img').dblclick();
                });	
				actions.waitForElementToShow('input[name="imageHeight"]', 5000);				
				actions.sendKeys(this.height, gemini.ARROW_RIGHT);
				actions.sendKeys(this.height, gemini.SHIFT+gemini.HOME);
				actions.sendKeys(this.height, '56');
				actions.sendKeys(this.height, gemini.SHIFT+gemini.HOME);
			})
			
			.capture('opened_size_menu_dialog', function (actions) {
				actions.click(this.menu)
			})
			
			.capture('resized', function (actions) {
				actions.click(this.apply)		
				actions.click(this.image)
			})
    });
	
	gemini.suite('with_closed_toolbar', function (test) {

        test.setUrl('/IntRichFieldEditor11.html').skip('chrome').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = '[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame';
				actions.wait(500);				
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

        test.setUrl('/IntRichFieldEditor10.html').skip('chrome').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions) {
                
				this.toolbar = '.controls-RichEditorToolbar__toggleButton';
				
				actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				actions.wait(500);				
            })

			.capture('plain')
			
			.capture('enabled', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').setEnabled(true);
                });	
				actions.wait(1000);
			})
			
			.capture('closed', function (actions) {
				actions.click(this.toolbar);
				actions.wait(1000);
			})
    });
		
	gemini.suite('with_closed_toolbar_2', function (test) {

        test.setUrl('/IntRichFieldEditor15.html').skip('chrome').setCaptureElements('[sbisname="FieldRichEditor 1"]')

            .before(function (actions) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				this.input = '[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame';
				this.textColor = '[sbisname="FieldRichEditor 1"] [sbisname="color"]'
				this.textAlign = '[sbisname="FieldRichEditor 1"] [sbisname="align"]'
				this.textList = '[sbisname="FieldRichEditor 1"] [sbisname="list"]'
				this.textStyle = '[sbisname="FieldRichEditor 1"] [sbisname="style"]'
				this.toolbar = '[sbisname="FieldRichEditor 1"] .controls-RichEditorToolbar__toggleButton'
				this.bold = '[sbisname="FieldRichEditor 1"] [sbisname="bold"]'
				this.italic = '[sbisname="FieldRichEditor 1"] [sbisname="italic"]'
				this.underline = '[sbisname="FieldRichEditor 1"] [sbisname="underline"]'
				this.strikethrough = '[sbisname="FieldRichEditor 1"] [sbisname="strikethrough"]'
				this.toolbar = '.controls-RichEditorToolbar__toggleButton';
				actions.wait(500);				
            })

			.capture('with_text', function (actions) {
				actions.click(this.toolbar);
				actions.click(this.input);
				actions.sendKeys(this.input, 'Заголовок');
				actions.sendKeys(this.input, gemini.SHIFT+gemini.HOME);
				actions.click(this.textStyle);
				actions.waitForElementToShow('.controls-RichEditorDropdown__itemText__title', 5000);
				actions.click('.controls-RichEditorDropdown__itemText__title');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'Подзаголовок');
				actions.sendKeys(this.input, gemini.SHIFT+gemini.HOME);
				actions.click(this.textStyle);
				actions.waitForElementToShow('.controls-RichEditorDropdown__itemText__subTitle', 5000);
				actions.click('.controls-RichEditorDropdown__itemText__subTitle');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'Выделенный основной');
				actions.sendKeys(this.input, gemini.SHIFT+gemini.HOME);
				actions.click(this.textStyle);
				actions.waitForElementToShow('.controls-RichEditorDropdown__itemText__selectedMainText', 5000);
				actions.click('.controls-RichEditorDropdown__itemText__selectedMainText');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'Дополнительный текст');
				actions.sendKeys(this.input, gemini.SHIFT+gemini.HOME);
				actions.click(this.textStyle);
				actions.waitForElementToShow('.controls-RichEditorDropdown__itemText__additionalText', 5000);
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
				actions.waitForElementToShow('.icon-AlignmentCenter', 5000);
				actions.click('.icon-AlignmentCenter');
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'справа');
				actions.click(this.textAlign);
				actions.waitForElementToShow('.icon-AlignmentRight', 5000);
				actions.click('.icon-AlignmentRight');
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'по ширине');
				actions.click(this.textAlign);
				actions.waitForElementToShow('.icon-AlignmentWidth', 5000);
				actions.click('.icon-AlignmentWidth');
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, 'список с точками');
				actions.click(this.textList);
				actions.waitForElementToShow('[data-id="InsertUnorderedList"]', 5000);
				actions.click('[data-id="InsertUnorderedList"]');
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, gemini.SHIFT+gemini.HOME);
				actions.sendKeys(this.input, 'список с цифрами');
				actions.click(this.textList);
				actions.waitForElementToShow('[data-id="InsertOrderedList"]', 5000);
				actions.click('[data-id="InsertOrderedList"]');
				actions.sendKeys(this.input, gemini.ARROW_RIGHT);
				actions.sendKeys(this.input, gemini.ENTER);
				actions.sendKeys(this.input, gemini.ENTER);
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

        test.setUrl('/IntRichFieldEditor16.html').skip('chrome').setCaptureElements('#editor')

            .before(function (actions) {
                actions.waitForElementToShow('[sbisname="FieldRichEditor 1"]', 40000);
				actions.waitForElementToShow('[sbisname="FieldRichEditor 2"]', 5000);
				actions.waitForElementToShow('[sbisname="FieldRichEditor 3"]', 5000);
				this.input = '[sbisname="FieldRichEditor 1"] .controls-RichEditor__editorFrame';
				this.input2 = '[sbisname="FieldRichEditor 2"] .controls-RichEditor__editorFrame';
				this.input3 = '[sbisname="FieldRichEditor 3"] .controls-RichEditor__editorFrame';
            })

            .capture('plain')
			
			.capture('with_text', function (actions) {
				actions.click(this.input)
				actions.sendKeys(this.input, 'tensor\nflow');
				actions.sendKeys(this.input, gemini.SHIFT+gemini.ARROW_LEFT);
			})
			
			.capture('disabled', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldRichEditor 1').setEnabled(false);
                });
			})			
    });
});