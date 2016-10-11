gemini.suite('SBIS3.CONTROLS.FieldLink Presto', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_field_link_presto.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.fl = '[sbisname="FieldLinkSingleSelect"]';
                this.box = '[sbisname="TextBox 1"] input';
				this.input = '.controls-TextBox__field';
                this.open_menu = '[sbisname="fieldLinkMenu"]';
				this.caption = '.controls-FieldLink__linkItem-caption';
				this.cross = '.controls-FieldLink__linkItem-cross';
				
                actions.waitForElementToShow(this.fl, 40000);
				actions.waitForElementToShow(this.box, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.box);
            })
			
			.capture('hovered_open_catalog', function (actions) {
                actions.mouseMove(this.open_menu);
            })

            .capture('with_link', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldLinkSingleSelect').setSelectedKeys([0])
                });
				actions.click(this.box);
            })

            .capture('hovered_text', function (actions) {
                actions.mouseMove(this.caption);
            })

            .capture('hovered_close_icon', function (actions) {
                actions.mouseMove(this.cross);
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldLinkSingleSelect').setEnabled(false)
                });
				actions.click(this.box);
            })
    });

    gemini.suite('with_multiselect', function (test) {

        test.setUrl('/regression_field_link_presto_2.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.fl = '[sbisname="FieldLinkMultiSelect"]';
                this.box = '[sbisname="TextBox 1"] input';
				this.input = '.controls-TextBox__field';
                this.more = '.controls-FieldLink__showAllLinks';
				this.clear_all = '.controls-FieldLink__showAllLinks ~ span .controls-Link-link';
				
                actions.waitForElementToShow(this.fl, 40000);
				actions.waitForElementToShow(this.box, 5000);
            })

            .capture('with_link', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldLinkMultiSelect').setSelectedKeys([0,2,3,4])
                });
                actions.click(this.box);
            })

            .capture('hovered_more', function (actions) {
                actions.mouseMove(this.more);
            })

            .capture('opened_more', function (actions) {
                actions.click(this.more);
            })

            .capture('hovered_clear_all', function (actions) {
                actions.mouseMove(this.clear_all);
            })
			
			.capture('disabled', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldLinkMultiSelect').setSelectedKeys([0,2,3,4,5,6])
					window.$ws.single.ControlStorage.getByName('FieldLinkMultiSelect').setEnabled(false)
                });
                actions.click(this.box);
            })

			.capture('disabled_and_opened_more', function (actions) {
				actions.click(this.more);
				actions.mouseMove(this.box);
            })
    });
	
	gemini.suite('underline_item', function (test) {

        test.setUrl('/regression_field_link_presto_3.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.fl = '[sbisname="FieldLinkSingleSelect"]';
                this.box = '[sbisname="TextBox 1"] input';
				this.input = '.controls-TextBox__field';
				this.caption = '.controls-FieldLink__linkItem-caption';
				
                actions.waitForElementToShow(this.fl, 40000);
				actions.waitForElementToShow(this.box, 5000);
            })

            .capture('with_link', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldLinkSingleSelect').setSelectedKeys([0])
                });
				actions.click(this.box);
            })

            .capture('hovered_text', function (actions) {
                actions.mouseMove(this.caption);
            })
    });
	
	gemini.suite('bold_item', function (test) {

        test.setUrl('/regression_field_link_presto_4.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.fl = '[sbisname="FieldLinkSingleSelect"]';
                this.box = '[sbisname="TextBox 1"] input';
				
                actions.waitForElementToShow(this.fl, 40000);
				actions.waitForElementToShow(this.box, 5000);
            })

            .capture('with_link', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldLinkSingleSelect').setSelectedKeys([0])
                });
				actions.click(this.box);
            })
    });
	
	gemini.suite('three_dict', function (test) {

        test.setUrl('/regression_field_link_presto_7.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.fl = '[sbisname="FieldLinkMultiSelect"]';
                this.box = '[sbisname="TextBox 1"] input';
				this.open_menu = '[sbisname="fieldLinkMenu"]';
				
                actions.waitForElementToShow(this.fl, 40000);
				actions.waitForElementToShow(this.box, 5000);
            })

            .capture('opened_catalog_list', function (actions) {
                actions.click(this.open_menu);
				actions.mouseMove(this.box);
            })
    });
	
	gemini.suite('hide_and_show_multiselect', function (test) {

        test.setUrl('/regression_field_link_presto_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.fl = '[sbisname="FieldLinkMultiSelect"]';
                this.box = '[sbisname="TextBox 1"] input';
                this.more = '.controls-FieldLink__showAllLinks';
				
                actions.waitForElementToShow(this.fl, 40000);
				actions.waitForElementToShow(this.box, 5000);
            })
			
			.capture('hidden', function (actions) {
				actions.executeJS(function (window) {
					window.$ws.single.ControlStorage.getByName('FieldLinkMultiSelect').hide()
                });
                actions.click(this.box);
            })
			
			.capture('shows', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldLinkMultiSelect').setSelectedKeys([0,2,3,4,5,6])
					window.$ws.single.ControlStorage.getByName('FieldLinkMultiSelect').show()
                });
                actions.click(this.box);
            })
			
			.capture('opened_more', function (actions) {
				actions.click(this.more);
				actions.mouseMove(this.box);
            })
    });
	
	gemini.suite('autocomlete', function (test) {

        test.setUrl('/regression_field_link_presto_8.html').setCaptureElements('html')

            .before(function (actions) {
				
				this.fl = '[sbisname="FieldLink 1"]';
				this.input = '[sbisname="FieldLink 1"] input';
				this.data0 = '[data-id="0"]';
				this.data2 = '[data-id="2"]';
				this.data3 = '[data-id="3"]';
				
                actions.waitForElementToShow(this.fl, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('with_autocomplete', function (actions) {
                actions.sendKeys(this.input, 'ене');
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.SHIFT+gemini.CONTROL+gemini.HOME);
				actions.waitForElementToShow(this.data0, 5000);
				actions.waitForElementToShow(this.data2, 5000);
				actions.waitForElementToShow(this.data3, 5000);
            })
			
			.capture('with_max_width', function (actions) {
                actions.executeJS(function (window) {
                    window.$('.controls-FieldLink__picker').attr('style', $('.controls-FieldLink__picker').attr('style') + " max-width: 300px;");
                });
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, 'р');
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.SHIFT+gemini.CONTROL+gemini.HOME);
				actions.waitForElementToShow(this.data0, 5000);
				actions.waitForElementToShow(this.data3, 5000);
				actions.wait(500);
            })
			
			.capture('not_found', function (actions) {
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, 'lsd');
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.SHIFT+gemini.CONTROL+gemini.HOME);
				actions.wait(500);
            })
    });
});