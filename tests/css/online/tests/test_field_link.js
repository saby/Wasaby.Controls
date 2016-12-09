var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.FieldLink Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_field_link_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldLinkSingleSelect"]', 40000);
                this.input = find('.controls-TextBox__field');
                this.open_menu = find('[sbisname="fieldLinkMenu"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.box = find('[sbisname="TextBox 1"] .controls-TextBox__field');
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
                actions.mouseMove('.controls-FieldLink__item-caption');
            })

            .capture('hovered_close_icon', function (actions) {
                actions.mouseMove('.controls-FieldLink__item-cross');
            })
			
			.capture('disabled', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldLinkSingleSelect').setEnabled(false)
                });
				actions.click(this.box);
            })
    });

    gemini.suite('with_multiselect', function (test) {

        test.setUrl('/regression_field_link_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldLinkMultiSelect"]', 40000);
                this.input = find('.controls-TextBox__field');
                this.open_menu = find('[sbisname="fieldLinkMenu"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.box = find('[sbisname="TextBox 1"] .controls-TextBox__field');
            })

            .capture('plain', function (actions) {
                actions.click(this.box);
            })
			
			.capture('hovered_open_catalog', function (actions) {
                actions.mouseMove(this.open_menu);
            })

            .capture('with_link', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldLinkMultiSelect').setSelectedKeys([0,2,3,4])
                });
                actions.click(this.box);
            })

            .capture('hovered_text_2', function (actions) {
                actions.mouseMove('[data-id="2"] .controls-FieldLink__item-caption');
            })

            .capture('hovered_close_icon_2', function (actions) {
                actions.mouseMove('[data-id="2"] .controls-FieldLink__item-cross');
            })

            .capture('hovered_more', function (actions) {
                actions.mouseMove('.controls-FieldLink__showAllLinks');
            })

            .capture('opened_more', function (actions) {
                actions.click('.controls-FieldLink__showAllLinks');
            })

            .capture('hovered_clear_all', function (actions) {
                actions.mouseMove('.controls-FieldLink__dropAllLinks');
            })
    });
	
	gemini.suite('underline_item', function (test) {

        test.setUrl('/regression_field_link_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldLinkSingleSelect"]', 40000);
                this.input = find('.controls-TextBox__field');
                this.open_menu = find('[sbisname="fieldLinkMenu"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.box = find('[sbisname="TextBox 1"] .controls-TextBox__field');
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
                actions.mouseMove('.controls-FieldLink__item-caption');
            })

            .capture('hovered_close_icon', function (actions) {
                actions.mouseMove('.controls-FieldLink__item-cross');
            })
    });
	
	gemini.suite('bold_item', function (test) {

        test.setUrl('/regression_field_link_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldLinkSingleSelect"]', 40000);
                this.input = find('.controls-TextBox__field');
                this.open_menu = find('[sbisname="fieldLinkMenu"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.box = find('[sbisname="TextBox 1"] .controls-TextBox__field');
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
                actions.mouseMove('.controls-FieldLink__item-caption');
            })

            .capture('hovered_close_icon', function (actions) {
                actions.mouseMove('.controls-FieldLink__item-cross');
            })
    });
	/*
	gemini.suite('three_dict', function (test) {

        test.setUrl('/regression_field_link_online_7.html').skip('chrome').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldLinkMultiSelect"]', 40000);
                this.input = find('.controls-TextBox__field');
                this.open_menu = find('[sbisname="fieldLinkMenu"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.box = find('[sbisname="TextBox 1"] .controls-TextBox__field');
            })

            .capture('opened_catalog_list', function (actions) {
                actions.click(this.open_menu);
				actions.wait(500);
				actions.mouseMove(this.box);
            })
    });
	*/
	gemini.suite('base_line', function (test) {

        test.setUrl('/regression_field_link_online_6.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldLinkMultiSelect"]', 40000);
                this.input = find('.controls-TextBox__field');
                this.open_menu = find('[sbisname="fieldLinkMenu"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.box = find('[sbisname="TextBox 1"] .controls-TextBox__field');
            })

            .capture('plain', function (actions) {
				actions.click(this.box);
            })
			
			.capture('with_link', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldLinkMultiSelect').setSelectedKeys([0,2,3,4])
                });
                actions.click(this.box);
            })

            .capture('opened_more', function (actions) {
                actions.click('.controls-FieldLink__showAllLinks');
            })
    });
	
	gemini.suite('disabled_multiselect', function (test) {

        test.setUrl('/regression_field_link_online_6.html').skip('chrome').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldLinkMultiSelect"]', 40000);
                this.input = find('.controls-TextBox__field');
                this.open_menu = find('[sbisname="fieldLinkMenu"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.box = find('[sbisname="TextBox 1"] .controls-TextBox__field');
            })

            .capture('disabled', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldLinkMultiSelect').setSelectedKeys([0,2,3,4,5,6])
					window.$ws.single.ControlStorage.getByName('FieldLinkMultiSelect').setEnabled(false)
                });
                actions.click(this.box);
            })

			.capture('opened_more', function (actions) {
				actions.executeJS(function (window) {
                    window.$('.capture').height(150);
                });
				actions.click('.controls-FieldLink__copyShowAll');
				actions.wait(500);
				actions.mouseMove(this.box);
            })
			
			.capture('disabled_one_big_item', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FieldLinkMultiSelect').setSelectedKeys([6])
                });
                actions.click(this.box);
            })
    });
	
	gemini.suite('hide_and_show_multiselect', function (test) {

        test.setUrl('/regression_field_link_online_6.html').skip('chrome').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldLinkMultiSelect"]', 40000);
                this.input = find('.controls-TextBox__field');
                this.open_menu = find('[sbisname="fieldLinkMenu"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.box = find('[sbisname="TextBox 1"] .controls-TextBox__field');
            })

            .capture('plain', function (actions) {				
                actions.click(this.box);
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
				actions.executeJS(function (window) {
                    window.$('.capture').height(150);
                });
				actions.click('.controls-FieldLink__showAllLinks');
				actions.wait(500);
				actions.mouseMove(this.box);
            })
    });
	
	gemini.suite('autocomlete', function (test) {

        test.setUrl('/regression_field_link_online_8.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="FieldLink 1"]', 40000);
                this.input = find('[sbisname="FieldLink 1"] .controls-TextBox__field');
            })

            .capture('with_autocomplete', function (actions) {
                actions.sendKeys(this.input, 'ене');
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.SHIFT+gemini.CONTROL+gemini.HOME);
				actions.wait(500);
            })
			
			.capture('with_max_width', function (actions) {
                actions.executeJS(function (window) {
                    window.$('.controls-FieldLink__picker').attr('style', $('.controls-FieldLink__picker').attr('style') + " max-width: 300px;");
                });
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, 'р');
				actions.sendKeys(this.input, gemini.END);
				actions.sendKeys(this.input, gemini.SHIFT+gemini.CONTROL+gemini.HOME);
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