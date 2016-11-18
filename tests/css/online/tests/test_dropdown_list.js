var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.DropdownList Online', function () {
	/*
    gemini.suite('base', function (test) {

        test.setUrl('/regression_dropdown_list_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = find('[name="DropdownList 1"]');
				this.title = find('[name="DropdownList 1"] .controls-DropdownList__text');
				this.item4 = find('.controls-DropdownList__item[data-id="4"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="4"]', 1000);
				actions.mouseMove(this.input);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item4);
            })
			
			.capture('selected', function (actions) {
                actions.click(this.item4);
				actions.mouseMove(this.input);
            })
    });
	
	gemini.suite('custom_header_template', function (test) {

        test.setUrl('/regression_dropdown_list_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="DropdownList1"]', 40000);
                this.list = find('[sbisname="DropdownList1"]');
				this.title = find('[sbisname="DropdownList1"] .controls-DropdownList__text');
				this.item4 = find('.controls-DropdownList__item[data-id="4"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="4"]', 1000);
				actions.mouseMove(this.input);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item4);
            })
			
			.capture('selected', function (actions) {
                actions.click(this.item4);
				actions.mouseMove(this.input);
            })
    });

    gemini.suite('disabled_base', function (test) {

        test.setUrl('/regression_dropdown_list_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = find('[name="DropdownList 1"]');
				this.title = find('[name="DropdownList 1"] .controls-DropdownList__text');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DropdownList1').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })
    });
	
	gemini.suite('hover_mode', function (test) {

        test.setUrl('/regression_dropdown_list_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = find('[name="DropdownList 1"]');
				this.title = find('[name="DropdownList 1"].controls-DropdownList .controls-DropdownList__text');
				this.item4 = find('.controls-DropdownList__item[data-id="4"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('opened', function (actions) {
                actions.mouseMove(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="4"]', 1000);
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item4);
            })
			
			.capture('selected', function (actions) {
                actions.click(this.item4);
				actions.mouseMove(this.input);
            })
    });

    gemini.suite('disabled_hover_mode', function (test) {

        test.setUrl('/regression_dropdown_list_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = find('[name="DropdownList 1"]');
				this.title = find('[name="DropdownList 1"].controls-DropdownList .controls-DropdownList__text');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DropdownList2').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })
    });
	
	gemini.suite('multiselect', function (test) {

        test.setUrl('/regression_dropdown_list_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = find('[name="DropdownList 1"]');
				this.title = find('[name="DropdownList 1"] .controls-DropdownList__text');
				this.item2 = find('.controls-DropdownList__item[data-id="2"]');
				this.item4 = find('.controls-DropdownList__item[data-id="4"]');
				this.apply = find('[sbisname="DropdownList_buttonChoose"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="2"]', 1000);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="4"]', 1000);
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
    });

    gemini.suite('disabled_multiselect', function (test) {

        test.setUrl('/regression_dropdown_list_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = find('[name="DropdownList 1"]');
				this.title = find('[name="DropdownList 1"] .controls-DropdownList__text');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DropdownList3').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })
    });*/
	
	gemini.suite('single', function (test) {

        test.setUrl('/regression_dropdown_list_online_6.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = '[name="DropdownList 1"]';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
				this.item4 = '.controls-DropdownList__item[data-id="4"]';
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = '[sbisname="TextBox 1"] input';
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="4"]', 1000);
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
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="3"]', 1000);
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

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = '[name="DropdownList 1"]';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
				this.item4 = '.controls-DropdownList__item[data-id="4"]';
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = '[sbisname="TextBox 1"] input';
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="4"]', 1000);
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
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="3"]', 1000);
				actions.mouseMove(this.input);
            })
			
			.capture('disabled', function (actions) {
				actions.click(this.input);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DropdownList 1').setEnabled(false);
                });
            })
    });
	
	gemini.suite('without_arrow', function (test) {

        test.setUrl('/regression_dropdown_list_online_8.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = '[name="DropdownList 1"]';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
				this.item4 = '.controls-DropdownList__item[data-id="4"]';
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = '[sbisname="TextBox 1"] input';
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="4"]', 1000);
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
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="3"]', 1000);
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

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = '[name="DropdownList 1"]';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
				this.item4 = '.controls-DropdownList__item[data-id="4"]';
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = '[sbisname="TextBox 1"] input';
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="4"]', 1000);
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
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="3"]', 1000);
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

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = '[name="DropdownList 1"]';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
				this.item4 = '.controls-DropdownList__item[data-id="4"]';
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = '[sbisname="TextBox 1"] input';
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="4"]', 1000);
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
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="3"]', 1000);
				actions.mouseMove(this.input);
            })
			
			.capture('disabled', function (actions) {
				actions.click(this.input);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DropdownList 1').setEnabled(false);
                });
            })
    });
	
	gemini.suite('multiselect2', function (test) {

        test.setUrl('/regression_dropdown_list_online_7.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = '[name="DropdownList 1"]';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
				this.item2 = '.controls-DropdownList__item[data-id="2"]';
				this.item2_box = '.controls-DropdownList__item[data-id="2"] .controls-DropdownList__itemCheckBox';
				this.item4 = '.controls-DropdownList__item[data-id="4"]';
				this.item4_box = '.controls-DropdownList__item[data-id="4"] .controls-DropdownList__itemCheckBox';
				this.apply = '[sbisname="DropdownList_buttonChoose"]';
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = '[sbisname="TextBox 1"] input';
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="2"]', 1000);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="4"]', 1000);
				actions.mouseMove(this.input);
            })
			
			.capture('selected_items', function (actions) {
                actions.mouseMove(this.item2);
				actions.waitForElementToShow(this.item2_box, 1000);
				actions.click(this.item2_box);
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
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="1"]', 1000);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="3"]', 1000);
				actions.mouseMove(this.input);
            })
			
			.capture('disabled', function (actions) {
				actions.click(this.input);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('DropdownList 1').setEnabled(false);
                });
            })
    });
	
	gemini.suite('footer_template', function (test) {

        test.setUrl('/regression_dropdown_list_online_12.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = '[name="DropdownList 1"]';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
				this.item4 = '.controls-DropdownList__item[data-id="4"]';
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = '[sbisname="TextBox 1"] input';
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="4"]', 1000);
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
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="3"]', 1000);
				actions.mouseMove(this.input);
            })
    });
	
	gemini.suite('item_template', function (test) {

        test.setUrl('/regression_dropdown_list_online_13.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = '[name="DropdownList 1"]';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
				this.item4 = '.controls-DropdownList__item[data-id="4"]';
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = '[sbisname="TextBox 1"] input';
				actions.executeJS(function (window) {
                    window.$('.capture').width(225);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="4"]', 1000);
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
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="3"]', 1000);
				actions.mouseMove(this.input);
            })
    });
	/*
	gemini.suite('head_template', function (test) {

        test.setUrl('/regression_dropdown_list_online_14.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = find('[name="DropdownList 1"]');
				this.title = find('[name="DropdownList 1"] .controls-DropdownList__selectedItem div');
				this.item4 = find('.controls-DropdownList__item[data-id="4"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.title);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="4"]', 1000);
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
                actions.click('[name="DropdownList 1"] .controls-DropdownList__selectedItem div');
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="3"]', 1000);
				actions.mouseMove(this.input);
            })
    });*/

    gemini.suite('ellipsis', function (test) {

        test.setUrl('/regression_dropdown_list_online_15.html').skip('chrome').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = '[name="DropdownList 1"]';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__textWrapper';
				this.item4 = '.controls-DropdownList__item[data-id="4"]';
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = '[sbisname="TextBox 1"] input';
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
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

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = '[name="DropdownList 1"]';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
				this.more = '.controls-DropdownListFooter_hasMore';
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = '[sbisname="TextBox 1"] input';
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="1"]', 1000);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="2"]', 1000);
				actions.waitForElementToShow('.controls-DropdownListFooter_hasMore', 1000);
				actions.mouseMove(this.input);
            })
			
			.capture('hovered_more', function (actions) {
                actions.mouseMove(this.more);
            })
    });
	
	gemini.suite('multiselect_with_more_link', function (test) {

        test.setUrl('/regression_dropdown_list_online_17.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DropdownList 1"]', 40000);
                this.list = '[name="DropdownList 1"]';
				this.title = '[name="DropdownList 1"] .controls-DropdownList__text';
				this.item1 = '.controls-DropdownList__item[data-id="1"]';
				this.item1_box = '.controls-DropdownList__item[data-id="1"] .controls-DropdownList__itemCheckBox';
				this.item2 = '.controls-DropdownList__item[data-id="2"]';				
				this.item2_box = '.controls-DropdownList__item[data-id="2"] .controls-DropdownList__itemCheckBox';
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = '[sbisname="TextBox 1"] input';
            })

            .capture('opened', function (actions) {
                actions.click(this.title);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="1"]', 1000);
				actions.waitForElementToShow('.controls-DropdownList__item[data-id="2"]', 1000);
				actions.waitForElementToShow('.controls-DropdownListFooter_hasMore', 1000);
				actions.mouseMove(this.input);
            })
			
			.capture('selected_items', function (actions) {
				actions.mouseMove(this.item1);
				actions.waitForElementToShow(this.item1_box, 1000);
                actions.click(this.item1_box);
				actions.click(this.item2_box);
				actions.mouseMove(this.input);
            })
    });
});