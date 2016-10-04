gemini.suite('SBIS3.CONTROLS.DropdownList Online', function () {	

	gemini.suite('single', function (test) {

        test.setUrl('/regression_dropdown_list_online_6.html').setCaptureElements('.capture')

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

        test.setUrl('/regression_dropdown_list_online_11.html').setCaptureElements('.capture')

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

        test.setUrl('/regression_dropdown_list_online_8.html').setCaptureElements('.capture')

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

        test.setUrl('/regression_dropdown_list_online_9.html').setCaptureElements('.capture')

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

        test.setUrl('/regression_dropdown_list_online_10.html').setCaptureElements('.capture')

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

        test.setUrl('/regression_dropdown_list_online_7.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dl = '[sbisname="DropdownList 1"]';
                this.input = '[name="TextBox 1"] input';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
				this.item1 = '.controls-DropdownList__item[data-id="1"]';
				this.item2 = '.controls-DropdownList__item[data-id="2"]';
				this.item3 = '.controls-DropdownList__item[data-id="3"]';
				this.item4 = '.controls-DropdownList__item[data-id="4"]';
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
                actions.click(this.item2);
				actions.click(this.item4);
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

        test.setUrl('/regression_dropdown_list_online_13.html').setCaptureElements('.capture')

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

        test.setUrl('/regression_dropdown_list_online_15.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.dl = '[sbisname="DropdownList 1"]';
                this.input = '[name="TextBox 1"] input';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
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

        test.setUrl('/regression_dropdown_list_online_16.html').setCaptureElements('.capture')

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

        test.setUrl('/regression_dropdown_list_online_17.html').setCaptureElements('.capture')

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
			
			.capture('selected_items', function (actions) {
                actions.click(this.item1);
				actions.click(this.item2);
				actions.mouseMove(this.input);
            })
    });
});