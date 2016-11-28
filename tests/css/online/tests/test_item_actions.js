var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.ItemsAction Online', function () {
	
    gemini.suite('TreeCompositeViewTable', function (test) {

        test.setUrl('/regression_items_action_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="TreeCompositeView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				this.item_4 = find('[data-id="4"]')
				this.item_15 = find('[data-id="15"]')
				this.expander = find('[data-id="4"] .controls-TreeView__expand')
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions [data-id="delete"]', 1000);
				this.delete_icon = find('.controls-ItemActions [data-id="delete"]');
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
            })

            .capture('plain')
			
			.capture('hovered_main_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('hovered_menu_button', function (actions) {
				actions.mouseMove(this.menu_button);
            })
			
			.capture('opened_menu', function (actions) {
				actions.click(this.menu_button);
            })
			
			.capture('hovered_second_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('expanded_folder', function (actions) {
				actions.click(this.expander);
				actions.waitForElementToShow('[data-id="13"]', 1000);
				actions.waitForElementToShow('[data-id="15"]', 1000);
				actions.mouseMove(this.item_4);
            })
			
			.capture('hovered_child', function (actions) {
				actions.mouseMove(this.item_15);
            })
    });
	
	gemini.suite('TreeCompositeViewTable BottomStyle', function (test) {

        test.setUrl('/regression_items_action_online_17.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="TreeCompositeView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				this.item_4 = find('[data-id="4"]')
				this.item_15 = find('[data-id="15"]')
				this.expander = find('[data-id="4"] .controls-TreeView__expand')
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions [data-id="delete"]', 1000);
				this.delete_icon = find('.controls-ItemActions [data-id="delete"]');
				actions.waitForElementToShow('.controls-ItemActions [data-id="edit"]', 1000);
				this.menu_button = find('.controls-ItemActions [data-id="edit"]');
            })

            .capture('plain')
			
			.capture('hovered_main_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('hovered_menu_button', function (actions) {
				actions.mouseMove(this.menu_button);
            })
			
			.capture('opened_menu', function (actions) {
				actions.click(this.menu_button);
            })
			
			.capture('hovered_second_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('expanded_folder', function (actions) {
				actions.click(this.expander);
				actions.waitForElementToShow('[data-id="13"]', 1000);
				actions.waitForElementToShow('[data-id="15"]', 1000);
				actions.mouseMove(this.item_4);
            })
			
			.capture('hovered_child', function (actions) {
				actions.mouseMove(this.item_15);
            })
    });
	
	gemini.suite('TreeCompositeViewList', function (test) {

        test.setUrl('/regression_items_action_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="TreeCompositeView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions [data-id="delete"]', 1000);
				this.delete_icon = find('.controls-ItemActions [data-id="delete"]');
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
            })

            .capture('plain')
			
			.capture('hovered_main_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('hovered_menu_button', function (actions) {
				actions.mouseMove(this.menu_button);
            })
			
			.capture('opened_menu', function (actions) {
				actions.click(this.menu_button);
            })
			
			.capture('hovered_second_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
    });
	
	gemini.suite('TreeCompositeViewTile', function (test) {

        test.setUrl('/regression_items_action_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="TreeCompositeView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions [data-id="delete"]', 1000);
				this.delete_icon = find('.controls-ItemActions [data-id="delete"]');
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
            })

            .capture('plain')
			
			.capture('hovered_main_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('hovered_menu_button', function (actions) {
				actions.mouseMove(this.menu_button);
            })
			
			.capture('opened_menu', function (actions) {
				actions.click(this.menu_button);
            })
			
			.capture('hovered_second_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
    });
	
    gemini.suite('CompositeViewTable', function (test) {

        test.setUrl('/regression_items_action_online_4.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="CompositeView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions [data-id="delete"]', 1000);
				this.delete_icon = find('.controls-ItemActions [data-id="delete"]');
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
            })

            .capture('plain')
			
			.capture('hovered_main_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('hovered_menu_button', function (actions) {
				actions.mouseMove(this.menu_button);
            })
			
			.capture('opened_menu', function (actions) {
				actions.click(this.menu_button);
            })
			
			.capture('hovered_second_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
    });
	
	gemini.suite('CompositeViewTable BottomStyle', function (test) {

        test.setUrl('/regression_items_action_online_18.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="CompositeView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions [data-id="delete"]', 1000);
				this.delete_icon = find('.controls-ItemActions [data-id="delete"]');
				actions.waitForElementToShow('.controls-ItemActions [data-id="edit"]', 1000);
				this.menu_button = find('.controls-ItemActions [data-id="edit"]');
            })

            .capture('plain')
			
			.capture('hovered_main_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('hovered_menu_button', function (actions) {
				actions.mouseMove(this.menu_button);
            })
			
			.capture('opened_menu', function (actions) {
				actions.click(this.menu_button);
            })
			
			.capture('hovered_second_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
    });
	
	gemini.suite('CompositeViewList', function (test) {

        test.setUrl('/regression_items_action_online_5.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="CompositeView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions [data-id="delete"]', 1000);
				this.delete_icon = find('.controls-ItemActions [data-id="delete"]');
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
            })

            .capture('plain')
			
			.capture('hovered_main_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('hovered_menu_button', function (actions) {
				actions.mouseMove(this.menu_button);
            })
			
			.capture('opened_menu', function (actions) {
				actions.click(this.menu_button);
            })
			
			.capture('hovered_second_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
    });
	
	gemini.suite('CompositeViewTile', function (test) {

        test.setUrl('/regression_items_action_online_6.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="CompositeView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions [data-id="delete"]', 1000);
				this.delete_icon = find('.controls-ItemActions [data-id="delete"]');
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
            })

            .capture('plain')
			
			.capture('hovered_main_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('hovered_menu_button', function (actions) {
				actions.mouseMove(this.menu_button);
            })
			
			.capture('opened_menu', function (actions) {
				actions.click(this.menu_button);
            })
			
			.capture('hovered_second_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
    });
	
	gemini.suite('DataGridView', function (test) {

        test.setUrl('/regression_items_action_online_7.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="DataGridView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions [data-id="delete"]', 1000);
				this.delete_icon = find('.controls-ItemActions [data-id="delete"]');
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
            })

            .capture('plain')
			
			.capture('hovered_main_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('hovered_menu_button', function (actions) {
				actions.mouseMove(this.menu_button);
            })
			
			.capture('opened_menu', function (actions) {
				actions.click(this.menu_button);
            })
			
			.capture('hovered_second_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
    });

    gemini.suite('DataGridView WithPosition', function (test) {

        test.setUrl('/regression_items_action_online_7.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="DataGridView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 5000);
				this.item_3 = find('[data-id="3"]')
				this.item_7 = find('[data-id="7"]')
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions [data-id="delete"]', 5000);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 5000);
            })

			.capture('top_right', function (actions) {

				actions.executeJS(function (window) {
                    window.$('.controls-ListView .controls-ItemsToolbar').css({top: 0});
                    window.$('.controls-ListView .controls-ItemsToolbar').css({bottom: 'auto'});
                });
                actions.mouseMove(this.item_7);
            })

			.capture('top_left', function (actions) {
				actions.executeJS(function (window) {
                    window.$('.controls-ListView .controls-ItemsToolbar').attr('style', '');
                    window.$('.controls-ListView .controls-ItemsToolbar').css({top: 0});
                    window.$('.controls-ListView .controls-ItemsToolbar').css({bottom: 'auto'});
                    window.$('.controls-ListView .controls-ItemsToolbar').css({left: 0});
                    window.$('.controls-ListView .controls-ItemsToolbar').css({right: 'auto'});
                });
                actions.mouseMove(this.item_3);
            })

			.capture('bottom_left', function (actions) {
				actions.executeJS(function (window) {
				    window.$('.controls-ListView .controls-ItemsToolbar').attr('style', '');
                    window.$('.controls-ListView .controls-ItemsToolbar').css({left: 0});
                    window.$('.controls-ListView .controls-ItemsToolbar').css({right: 'auto'});
                });
                actions.mouseMove(this.item_7);
            })
    });
	
	gemini.suite('DataGridView Hierarchy', function (test) {

        test.setUrl('/regression_items_action_online_24.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="DataGridView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				this.item_10 = find('[data-id="10"]')
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions [data-id="delete"]', 1000);
				this.delete_icon = find('.controls-ItemActions [data-id="delete"]');
				this.cut_icon = find('.controls-ItemActions__menu-container  [data-id="cut"]')
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
            })

            .capture('plain')
			
			.capture('hovered_main_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('hovered_menu_button', function (actions) {
				actions.mouseMove(this.menu_button);
            })
			
			.capture('opened_menu', function (actions) {
				actions.click(this.menu_button);
				actions.mouseMove(this.item_10);
            })
			
			.capture('hovered_second_action', function (actions) {
				actions.mouseMove(this.cut_icon);
            })
    });

	gemini.suite('DataGridView PartScroll', function (test) {

        test.setUrl('/regression_items_action_online_21.html').skip('chrome').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="DataGrid 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')				
				this.right = find('.controls-DataGridView__PartScroll__arrowRight');
				actions.click(this.right);
				actions.click(this.right);
				actions.click(this.right);
				actions.mouseMove(this.item_3);
            })

            .capture('plain')
			
			.capture('opened_menu', function (actions) {
				actions.executeJS(function (window) {
                    window.$('.controls-ItemActions__menu-button').click();
                });
            })
    });

	gemini.suite('DataGridView BottomStyle', function (test) {

        test.setUrl('/regression_items_action_online_19.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="DataGridView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions [data-id="delete"]', 1000);
				this.delete_icon = find('.controls-ItemActions [data-id="delete"]');
				actions.waitForElementToShow('.controls-ItemActions [data-id="edit"]', 1000);
				this.menu_button = find('.controls-ItemActions [data-id="edit"]');
            })

            .capture('plain')
			
			.capture('hovered_main_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('hovered_menu_button', function (actions) {
				actions.mouseMove(this.menu_button);
            })
			
			.capture('opened_menu', function (actions) {
				actions.click(this.menu_button);
            })
			
			.capture('hovered_second_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
    });
	
	gemini.suite('TreeDataGridView', function (test) {

        test.setUrl('/regression_items_action_online_8.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="TreeDataGridView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				this.item_4 = find('[data-id="4"]')
				this.item_15 = find('[data-id="15"]')
				this.expander = find('[data-id="4"] .controls-TreeView__expand')
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions [data-id="delete"]', 1000);
				this.delete_icon = find('.controls-ItemActions [data-id="delete"]');
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
            })

            .capture('plain')
			
			.capture('hovered_main_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('hovered_menu_button', function (actions) {
				actions.mouseMove(this.menu_button);
            })
			
			.capture('opened_menu', function (actions) {
				actions.click(this.menu_button);
            })
			
			.capture('hovered_second_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('expanded_folder', function (actions) {
				actions.click(this.expander);
				actions.waitForElementToShow('[data-id="13"]', 1000);
				actions.waitForElementToShow('[data-id="15"]', 1000);
				actions.mouseMove(this.item_4);
            })
			
			.capture('hovered_child', function (actions) {
				actions.mouseMove(this.item_15);
            })
    });
	
	gemini.suite('TreeDataGridView Hierarchy', function (test) {

        test.setUrl('/regression_items_action_online_25.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="TreeDataGridView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				this.item_4 = find('[data-id="4"]')
				this.item_12 = find('[data-id="12"]')
				this.item_15 = find('[data-id="15"]')
				this.expander = find('[data-id="4"] .controls-TreeView__expand')
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions [data-id="delete"]', 1000);
				this.delete_icon = find('.controls-ItemActions [data-id="delete"]');
				this.cut_icon = find('.controls-ItemActions__menu-container  [data-id="cut"]')
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
            })

            .capture('plain')
			
			.capture('hovered_main_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('hovered_menu_button', function (actions) {
				actions.mouseMove(this.menu_button);
            })
			
			.capture('opened_menu', function (actions) {
				actions.click(this.menu_button);
				actions.mouseMove(this.item_12);
            })
			
			.capture('hovered_second_action', function (actions) {
				actions.mouseMove(this.cut_icon);
            })
			
			.capture('expanded_folder', function (actions) {
				actions.click(this.expander);
				actions.waitForElementToShow('[data-id="13"]', 1000);
				actions.waitForElementToShow('[data-id="15"]', 1000);
				actions.mouseMove(this.item_4);
            })
			
			.capture('hovered_child', function (actions) {
				actions.mouseMove(this.item_15);
            })
    });
	
	gemini.suite('TreeDataGridView AddNewNodeInFolder', function (test) {

        test.setUrl('/regression_items_action_online_23.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="browserView"]', 40000);
                actions.waitForElementToShow('[data-id="5"]', 1000);
				this.item_5 = find('[data-id="5"]')
				this.item_7 = find('[data-id="7"]')
				this.item_8 = find('[data-id="8"]')
				this.expander = find('[data-id="5"] .controls-TreeView__expand')
				actions.mouseMove(this.item_8);
				actions.waitForElementToShow('.controls-ItemActions [data-id="delete"]', 1000);
				this.delete_icon = find('.controls-ItemActions [data-id="delete"]');
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
            })

            .capture('plain')
			
			.capture('hovered_main_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('hovered_menu_button', function (actions) {
				actions.mouseMove(this.menu_button);
            })
			
			.capture('opened_menu', function (actions) {
				actions.click(this.menu_button);
            })
			
			.capture('hovered_second_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('expanded_folder', function (actions) {
				actions.click(this.expander);
				actions.waitForElementToShow('[data-id="6"]', 1000);
				actions.waitForElementToShow('[data-id="7"]', 1000);
				actions.mouseMove(this.item_5);
            })
			
			.capture('hovered_child', function (actions) {
				actions.mouseMove(this.item_7);
            })
    });

	gemini.suite('TreeDataGridView PartScroll', function (test) {

        test.setUrl('/regression_items_action_online_22.html').skip('chrome').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="TreeDataGrid 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				this.item_4 = find('[data-id="4"]')
				this.item_15 = find('[data-id="15"]')
				this.expander = find('[data-id="3"] .controls-TreeView__expand')				
				this.right = find('.controls-DataGridView__PartScroll__arrowRight');
				actions.click(this.right);
				actions.click(this.right);
				actions.click(this.right);
				actions.mouseMove(this.item_4);
            })

            .capture('plain')
			
			.capture('opened_menu', function (actions) {
				actions.executeJS(function (window) {
                    window.$('.controls-ItemActions__menu-button').click();
                });
            })
			
			.capture('expanded_folder', function (actions) {
				actions.executeJS(function (window) {
                    window.$('.controls-ItemActions__menu-button').click();
                });
				actions.click(this.expander);
				actions.waitForElementToShow('[data-id="13"]', 1000);
				actions.waitForElementToShow('[data-id="15"]', 1000);
				actions.mouseMove(this.item_3);
            })
			
			.capture('hovered_child', function (actions) {
				actions.mouseMove(this.item_15);
            })
    });

	gemini.suite('TreeDataGridView BottomStyle', function (test) {

        test.setUrl('/regression_items_action_online_20.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="TreeDataGridView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				this.item_4 = find('[data-id="4"]')
				this.item_15 = find('[data-id="15"]')
				this.expander = find('[data-id="4"] .controls-TreeView__expand')
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions [data-id="delete"]', 1000);
				this.delete_icon = find('.controls-ItemActions [data-id="delete"]');
				actions.waitForElementToShow('.controls-ItemActions [data-id="edit"]', 1000);
				this.menu_button = find('.controls-ItemActions [data-id="edit"]');
            })

            .capture('plain')
			
			.capture('hovered_main_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('hovered_menu_button', function (actions) {
				actions.mouseMove(this.menu_button);
            })
			
			.capture('opened_menu', function (actions) {
				actions.click(this.menu_button);
            })
			
			.capture('hovered_second_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('expanded_folder', function (actions) {
				actions.click(this.expander);
				actions.waitForElementToShow('[data-id="13"]', 1000);
				actions.waitForElementToShow('[data-id="15"]', 1000);
				actions.mouseMove(this.item_4);
            })
			
			.capture('hovered_child', function (actions) {
				actions.mouseMove(this.item_15);
            })
    });

	gemini.suite('TreeCompositeViewTable Item Lenght', function (test) {

        test.setUrl('/regression_items_action_online_9.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="TreeCompositeView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				actions.waitForElementToShow('[data-id="4"]', 1000);
				this.item_4 = find('[data-id="4"]')
				this.item_12 = find('[data-id="12"]')				
            })

			.capture('with_read_item', function (actions, find) {
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
			
			.capture('without_read_item', function (actions, find) {
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.click(this.close_button);
				actions.mouseMove(this.item_4);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
			
			.capture('with_read_item_again', function (actions, find) {
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.click(this.close_button);
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
    });

	gemini.suite('TreeCompositeViewList Item Lenght', function (test) {

        test.setUrl('/regression_items_action_online_10.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="TreeCompositeView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				actions.waitForElementToShow('[data-id="4"]', 1000);
				this.item_4 = find('[data-id="4"]')
				this.item_12 = find('[data-id="12"]')				
            })

			.capture('with_read_item', function (actions, find) {
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
			
			.capture('without_read_item', function (actions, find) {
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.click(this.close_button);
				actions.mouseMove(this.item_4);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
			
			.capture('with_read_item_again', function (actions, find) {
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.click(this.close_button);
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
    });
	
	gemini.suite('TreeCompositeViewTile Item Lenght', function (test) {

        test.setUrl('/regression_items_action_online_11.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="TreeCompositeView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				actions.waitForElementToShow('[data-id="4"]', 1000);
				this.item_4 = find('[data-id="4"]')
				this.item_12 = find('[data-id="12"]')				
            })

			.capture('with_read_item', function (actions, find) {
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
			
			.capture('without_read_item', function (actions, find) {
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.click(this.close_button);
				actions.mouseMove(this.item_4);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
			
			.capture('with_read_item_again', function (actions, find) {
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.click(this.close_button);
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
    });
	
    gemini.suite('CompositeViewTable Item Lenght', function (test) {

        test.setUrl('/regression_items_action_online_12.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="CompositeView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				actions.waitForElementToShow('[data-id="4"]', 1000);
				this.item_4 = find('[data-id="4"]')				
				this.item_12 = find('[data-id="12"]')
			})

			.capture('with_read_item', function (actions, find) {
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
			
			.capture('without_read_item', function (actions, find) {
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.click(this.close_button);
				actions.mouseMove(this.item_4);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
			
			.capture('with_read_item_again', function (actions, find) {
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.click(this.close_button);
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
    });
	
	gemini.suite('CompositeViewList Item Lenght', function (test) {

        test.setUrl('/regression_items_action_online_13.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="CompositeView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				actions.waitForElementToShow('[data-id="4"]', 1000);
				this.item_4 = find('[data-id="4"]')				
				this.item_12 = find('[data-id="12"]')
            })

			.capture('with_read_item', function (actions, find) {
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
			
			.capture('without_read_item', function (actions, find) {
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.click(this.close_button);
				actions.mouseMove(this.item_4);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
			
			.capture('with_read_item_again', function (actions, find) {
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.click(this.close_button);
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
    });
	
	gemini.suite('CompositeViewTile Item Lenght', function (test) {

        test.setUrl('/regression_items_action_online_14.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="CompositeView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				actions.waitForElementToShow('[data-id="4"]', 1000);
				this.item_4 = find('[data-id="4"]')		
				this.item_12 = find('[data-id="12"]')						
            })

			.capture('with_read_item', function (actions, find) {
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
			
			.capture('without_read_item', function (actions, find) {
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.click(this.close_button);
				actions.mouseMove(this.item_4);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
			
			.capture('with_read_item_again', function (actions, find) {
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.click(this.close_button);
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
    });
	
	gemini.suite('DataGridView Item Lenght', function (test) {

        test.setUrl('/regression_items_action_online_15.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="DataGridView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				actions.waitForElementToShow('[data-id="4"]', 1000);
				this.item_4 = find('[data-id="4"]')				
				this.item_12 = find('[data-id="12"]')	
            })

			.capture('with_read_item', function (actions, find) {
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
			
			.capture('without_read_item', function (actions, find) {
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.click(this.close_button);
				actions.mouseMove(this.item_4);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
			
			.capture('with_read_item_again', function (actions, find) {
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.click(this.close_button);
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
    });

	gemini.suite('TreeDataGridView Item Lenght', function (test) {

        test.setUrl('/regression_items_action_online_16.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="TreeDataGridView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				actions.waitForElementToShow('[data-id="4"]', 1000);
				this.item_4 = find('[data-id="4"]')
				this.item_12 = find('[data-id="12"]')				
            })

			.capture('with_read_item', function (actions, find) {
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
			
			.capture('without_read_item', function (actions, find) {
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.click(this.close_button);
				actions.mouseMove(this.item_4);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
			
			.capture('with_read_item_again', function (actions, find) {
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.click(this.close_button);
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				actions.mouseMove(this.item_12);
            })
    });
	
	gemini.suite('TreeCompositeViewList SelectionOnItemClick', function (test) {

        test.setUrl('/regression_items_action_online_26.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="TreeDataGridView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
                this.data3 = find('[data-id="3"]')				
				this.delete_icon = find('.controls-ItemActions [data-id="delete"]');
            })
			
			.capture('clicked_main_action', function (actions) {
				actions.mouseMove(this.data3);
				actions.waitForElementToShow('.controls-ItemActions [data-id="delete"]', 1000);
				actions.click(this.delete_icon);
				actions.wait(500);
            })			
    });
	
	gemini.suite('TreeDataGridView LongItemName', function (test) {

        test.setUrl('/regression_items_action_online_27.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="TreeDataGridView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				this.item_4 = find('[data-id="4"]')
				this.item_15 = find('[data-id="15"]')
				this.expander = find('[data-id="4"] .controls-TreeView__expand')
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions [data-id="delete"]', 1000);
				this.delete_icon = find('.controls-ItemActions [data-id="delete"]');
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
            })
			
			.capture('opened_menu', function (actions) {
				actions.click(this.menu_button);
				actions.mouseMove(this.item_4);
            })
    });
});