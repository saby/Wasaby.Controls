gemini.suite('SBIS3.CONTROLS.DropdownList Presto', function () {	

	gemini.suite('single', function (test) {

        test.setUrl('/regression_dropdown_list_presto_6.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dl = '[sbisname="DropdownList 1"]';
                this.input = '[name="TextBox 1"] input';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
				this.item3 = '.controls-DropdownList__item[data-id="3"]';
				this.item4 = '.controls-DropdownList__item[data-id="4"]';
				
				actions.waitForElementToShow(this.dl, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow(this.item4, 5000);
				actions.mouseMove(this.input);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item4);
            })
			
			.capture('selected', function (actions) {
                actions.click(this.item4);
				actions.mouseMove(this.input);
            })
			
			.capture('opened_again', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow(this.item3, 5000);
				actions.mouseMove(this.input);
            })
			
			.capture('disabled', function (actions) {
				actions.click(this.input);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DropdownList 1').setEnabled(false);
                });
            })
    });
	
	gemini.suite('show_selected_item_in_list', function (test) {

        test.setUrl('/regression_dropdown_list_presto_11.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dl = '[sbisname="DropdownList 1"]';
                this.input = '[name="TextBox 1"] input';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
				this.item3 = '.controls-DropdownList__item[data-id="3"]';
				this.item4 = '.controls-DropdownList__item[data-id="4"]';
				
				actions.waitForElementToShow(this.dl, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow(this.item4, 5000);
				actions.mouseMove(this.input);
            })
    });
	
	gemini.suite('without_arrow', function (test) {

        test.setUrl('/regression_dropdown_list_presto_8.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dl = '[sbisname="DropdownList 1"]';
                this.input = '[name="TextBox 1"] input';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
				this.item3 = '.controls-DropdownList__item[data-id="3"]';
				this.item4 = '.controls-DropdownList__item[data-id="4"]';
				
				actions.waitForElementToShow(this.dl, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow(this.item4, 5000);
				actions.mouseMove(this.input);
            })
			
			.capture('selected', function (actions) {
                actions.click(this.item4);
				actions.mouseMove(this.input);
            })
			
			.capture('disabled', function (actions) {
				actions.click(this.input);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DropdownList 1').setEnabled(false);
                });
            })
    });
	
	gemini.suite('without_cross', function (test) {

        test.setUrl('/regression_dropdown_list_presto_9.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dl = '[sbisname="DropdownList 1"]';
                this.input = '[name="TextBox 1"] input';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
				this.item3 = '.controls-DropdownList__item[data-id="3"]';
				this.item4 = '.controls-DropdownList__item[data-id="4"]';
				
				actions.waitForElementToShow(this.dl, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })
			
			.capture('selected', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow(this.item4, 5000);
				actions.click(this.item4);
				actions.mouseMove(this.input);
            })
			
			.capture('opened_again', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow(this.item3, 5000);
				actions.mouseMove(this.input);
            })
			
			.capture('disabled', function (actions) {
				actions.click(this.input);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DropdownList 1').setEnabled(false);
                });
            })
    });
	
	gemini.suite('link_style', function (test) {

        test.setUrl('/regression_dropdown_list_presto_10.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dl = '[sbisname="DropdownList 1"]';
                this.input = '[name="TextBox 1"] input';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
				
				actions.waitForElementToShow(this.dl, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })
			
			.capture('disabled', function (actions) {
				actions.click(this.input);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DropdownList 1').setEnabled(false);
                });
            })
    });
	
	gemini.suite('multiselect', function (test) {

        test.setUrl('/regression_dropdown_list_presto_7.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dl = '[sbisname="DropdownList 1"]';
                this.input = '[name="TextBox 1"] input';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
				this.item1 = '.controls-DropdownList__item[data-id="1"]';
				this.item2 = '.controls-DropdownList__item[data-id="2"]';
				this.item2_box = '.controls-DropdownList__item[data-id="2"] .controls-DropdownList__itemCheckBox';
				this.item3 = '.controls-DropdownList__item[data-id="3"]';
				this.item4 = '.controls-DropdownList__item[data-id="4"]';
				this.item4_box = '.controls-DropdownList__item[data-id="4"] .controls-DropdownList__itemCheckBox';
				this.apply = '[sbisname="DropdownList_buttonChoose"]';
				
				actions.waitForElementToShow(this.dl, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow(this.item2, 5000);
				actions.waitForElementToShow(this.item4, 5000);
				actions.mouseMove(this.input);
            })
			
			.capture('selected_items', function (actions) {
                actions.mouseMove(this.item2);
				actions.waitForElementToShow(this.item2_box, 5000);
				actions.click(this.item2_box);
				actions.mouseMove(this.item4);
				actions.waitForElementToShow(this.item4_box, 5000);
				actions.click(this.item4_box);
				actions.mouseMove(this.input);
            })
			
			.capture('hovered_apply', function (actions) {
				actions.mouseMove(this.apply);
            })
			
			.capture('selected', function (actions) {
                actions.click(this.apply);
				actions.mouseMove(this.input);
            })
			
			.capture('opened_again', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow(this.item1, 5000);
				actions.waitForElementToShow(this.item3, 5000);
				actions.mouseMove(this.input);
            })
			
			.capture('disabled', function (actions) {
				actions.click(this.input);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DropdownList 1').setEnabled(false);
                });
            })
    });
	
	gemini.suite('item_template', function (test) {

        test.setUrl('/regression_dropdown_list_presto_13.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dl = '[sbisname="DropdownList 1"]';
                this.input = '[name="TextBox 1"] input';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
				this.item4 = '.controls-DropdownList__item[data-id="4"]';
				
				actions.waitForElementToShow(this.dl, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow(this.item4, 5000);
				actions.mouseMove(this.input);
            })
    });

    gemini.suite('ellipsis', function (test) {

        test.setUrl('/regression_dropdown_list_presto_15.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dl = '[sbisname="DropdownList 1"]';
                this.input = '[name="TextBox 1"] input';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__textWrapper';
				this.item4 = '.controls-DropdownList__item[data-id="4"]';
				
				actions.waitForElementToShow(this.dl, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow(this.item4, 5000);
				actions.mouseMove(this.input);
            })

			.capture('disabled', function (actions) {
				actions.click(this.input);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DropdownList 1').setEnabled(false);
                });
            })
    });
	
	gemini.suite('single_with_more_link', function (test) {

        test.setUrl('/regression_dropdown_list_presto_16.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dl = '[sbisname="DropdownList 1"]';
                this.input = '[name="TextBox 1"] input';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
				this.item1 = '.controls-DropdownList__item[data-id="1"]';
				this.item2 = '.controls-DropdownList__item[data-id="2"]';
				this.more = '.controls-DropdownListFooter_hasMore';
				
				actions.waitForElementToShow(this.dl, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow(this.item1, 5000);
				actions.waitForElementToShow(this.item2, 5000);
				actions.waitForElementToShow(this.more, 5000);
				actions.mouseMove(this.input);
            })
			
			.capture('hovered_more', function (actions) {
                actions.mouseMove(this.more);
            })
    });
	
	gemini.suite('multiselect_with_more_link', function (test) {

        test.setUrl('/regression_dropdown_list_presto_17.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dl = '[sbisname="DropdownList 1"]';
                this.input = '[name="TextBox 1"] input';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
				this.item1 = '.controls-DropdownList__item[data-id="1"]';
				this.item1_box = '.controls-DropdownList__item[data-id="1"] .controls-DropdownList__itemCheckBox';
				this.item2 = '.controls-DropdownList__item[data-id="2"]';
				this.item2_box = '.controls-DropdownList__item[data-id="2"] .controls-DropdownList__itemCheckBox';
				this.more = '.controls-DropdownListFooter_hasMore';
				
				actions.waitForElementToShow(this.dl, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow(this.item1, 5000);
				actions.waitForElementToShow(this.item2, 5000);
				actions.waitForElementToShow(this.more, 5000);
				actions.mouseMove(this.input);
            })
			
			.capture('selected_items', function (actions) {
                actions.mouseMove(this.item1);
				actions.waitForElementToShow(this.item1_box, 5000);
				actions.click(this.item1_box);
				actions.mouseMove(this.item2);
				actions.waitForElementToShow(this.item2_box, 5000);
				actions.click(this.item2_box);
				actions.mouseMove(this.input);
            })
    });
});