gemini.suite('SBIS3.CONTROLS.ItemsAction Online', function () {
	
    gemini.suite('TreeCompositeViewTable', function (test) {

        test.setUrl('/regression_items_action_online.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.table = '[sbisname="TreeCompositeView 1"]';
				this.item_3 = '[data-id="3"]';
				this.item_4 = '[data-id="4"]';
				this.item_5 = '[data-id="5"]';
				this.item_13 = '[data-id="13"]';
				this.item_15 = '[data-id="15"]';
				this.expander = '[data-id="4"] .controls-TreeView__expand';
				this.delete_icon = '.controls-ItemActions [data-id="delete"]';
				this.menu_button = '.controls-ItemActions .controls-ItemActions__menu-button';
				this.selected = '.controls-ListView__item__selected';
                
				actions.waitForElementToShow(this.table, 40000);
                actions.waitForElementToShow(this.item_3, 5000);
            })

            .capture('plain', function (actions) {
				actions.mouseMove(this.item_3);
            })
			
			.capture('hovered_main_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('hovered_menu_button', function (actions) {
				actions.mouseMove(this.menu_button);
            })
			
			.capture('opened_menu', function (actions) {
				actions.click(this.menu_button);
				actions.waitForElementToShow(this.selected, 5000);
            })
			
			.capture('hovered_second_action', function (actions) {
				actions.mouseMove(this.delete_icon);
            })
			
			.capture('expanded_folder', function (actions) {
				actions.click(this.expander);
				actions.waitForElementToShow(this.item_13, 5000);
				actions.waitForElementToShow(this.item_15, 5000);
				actions.mouseMove(this.item_4);
            })
			
			.capture('hovered_child', function (actions) {
				actions.mouseMove(this.item_15);
            })
			
			.capture('disabled_and_hovered', function (actions) {
				actions.executeJS(function (window) {
                    window.$('[sbisname="TreeCompositeView 1"]').wsControl().setEnabled(false);
                });
				actions.mouseMove(this.item_4);
            })
    });
	
	
	gemini.suite('TreeCompositeViewList', function (test) {

        test.setUrl('/regression_items_action_online_2.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.table = '[sbisname="TreeCompositeView 1"]';
				this.item_3 = '[data-id="3"]';
				this.menu_button = '.controls-ItemActions .controls-ItemActions__menu-button';
				this.selected = '.controls-ListView__item__selected';
                
				actions.waitForElementToShow(this.table, 40000);
                actions.waitForElementToShow(this.item_3, 5000);
            })
			
			.capture('opened_menu', function (actions) {
				actions.mouseMove(this.item_3);
				actions.click(this.menu_button);
				actions.waitForElementToShow(this.selected, 5000);
            })
    });
	
	gemini.suite('TreeCompositeViewTile', function (test) {

        test.setUrl('/regression_items_action_online_3.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.table = '[sbisname="TreeCompositeView 1"]';
				this.item_3 = '[data-id="3"]';
				this.menu_button = '.controls-ItemActions .controls-ItemActions__menu-button';
				this.selected = '.controls-ListView__item__selected';
                
				actions.waitForElementToShow(this.table, 40000);
                actions.waitForElementToShow(this.item_3, 5000);
            })

			.capture('opened_menu', function (actions) {
				actions.mouseMove(this.item_3);
				actions.click(this.menu_button);
				actions.waitForElementToShow(this.selected, 5000);
            })
    });
	
    gemini.suite('CompositeViewTable', function (test) {

        test.setUrl('/regression_items_action_online_4.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.table = '[sbisname="CompositeView 1"]';
				this.item_3 = '[data-id="3"]';
				this.menu_button = '.controls-ItemActions .controls-ItemActions__menu-button';
				this.selected = '.controls-ListView__item__selected';
                
				actions.waitForElementToShow(this.table, 40000);
                actions.waitForElementToShow(this.item_3, 5000);
            })

			.capture('opened_menu', function (actions) {
				actions.mouseMove(this.item_3);
				actions.click(this.menu_button);
				actions.waitForElementToShow(this.selected, 5000);
            })
    });
	
	gemini.suite('CompositeViewList', function (test) {

        test.setUrl('/regression_items_action_online_5.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.table = '[sbisname="CompositeView 1"]';
				this.item_3 = '[data-id="3"]';
				this.menu_button = '.controls-ItemActions .controls-ItemActions__menu-button';
				this.selected = '.controls-ListView__item__selected';
                
				actions.waitForElementToShow(this.table, 40000);
                actions.waitForElementToShow(this.item_3, 5000);
            })

			.capture('opened_menu', function (actions) {
				actions.mouseMove(this.item_3);
				actions.click(this.menu_button);
				actions.waitForElementToShow(this.selected, 5000);
            })
    });
	
	gemini.suite('CompositeViewTile', function (test) {

        test.setUrl('/regression_items_action_online_6.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.table = '[sbisname="CompositeView 1"]';
				this.item_3 = '[data-id="3"]';
				this.menu_button = '.controls-ItemActions .controls-ItemActions__menu-button';
				this.selected = '.controls-ListView__item__selected';
                
				actions.waitForElementToShow(this.table, 40000);
                actions.waitForElementToShow(this.item_3, 5000);
            })

			.capture('opened_menu', function (actions) {
				actions.mouseMove(this.item_3);
				actions.click(this.menu_button);
				actions.waitForElementToShow(this.selected, 5000);
            })
    });
	
	gemini.suite('DataGridView', function (test) {

        test.setUrl('/regression_items_action_online_7.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.table = '[sbisname="DataGridView 1"]';
				this.item_3 = '[data-id="3"]';
				this.menu_button = '.controls-ItemActions .controls-ItemActions__menu-button';
				this.selected = '.controls-ListView__item__selected';
                
				actions.waitForElementToShow(this.table, 40000);
                actions.waitForElementToShow(this.item_3, 5000);
            })

			.capture('opened_menu', function (actions) {
				actions.mouseMove(this.item_3);
				actions.click(this.menu_button);
				actions.waitForElementToShow(this.selected, 5000);
            })
    });
	
	gemini.suite('DataGridView Hierarchy', function (test) {

        test.setUrl('/regression_items_action_online_24.html').setCaptureElements('html')

            .before(function (actions) {
				
				this.table = '[sbisname="DataGridView 1"]';
				this.item_3 = '[data-id="3"]';
				this.item_10 = '[data-id="10"]';
				this.cut = '.controls-ItemActions__menu-container [data-id="cut"].controls-Menu__hasChild';
				this.menu_button = '.controls-ItemActions .controls-ItemActions__menu-button';
                
				actions.waitForElementToShow(this.table, 40000);
                actions.waitForElementToShow(this.item_3, 5000);
            })
			
			.capture('opened_menu', function (actions) {
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow(this.menu_button, 5000);
				actions.click(this.menu_button);
				actions.mouseMove(this.item_10);
				actions.waitForElementToShow(this.cut, 5000);
				actions.mouseMove(this.cut);
            })
    });

	gemini.suite('TreeDataGridView', function (test) {

        test.setUrl('/regression_items_action_online_8.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.grid = '[sbisname="TreeDataGridView 1"]';
				this.item_3 = '[data-id="3"]';
				this.item_4 = '[data-id="4"]';
				this.item_13 = '[data-id="13"]';
				this.item_15 = '[data-id="15"]';
				this.expander = '[data-id="4"] .controls-TreeView__expand';
				this.delete_icon = '.controls-ItemActions [data-id="delete"]';
				this.menu_button = '.controls-ItemActions .controls-ItemActions__menu-button';
				this.selected = '.controls-ListView__item__selected';
                
				actions.waitForElementToShow(this.grid, 40000);
                actions.waitForElementToShow(this.item_3, 5000);
            })
			
			.capture('opened_menu', function (actions) {
				actions.mouseMove(this.item_3);
				actions.click(this.menu_button);
				actions.waitForElementToShow(this.selected, 5000);
            })
			
			.capture('expanded_folder', function (actions) {
				actions.click(this.expander);
				actions.waitForElementToShow(this.item_13, 1000);
				actions.waitForElementToShow(this.item_15, 1000);
				actions.mouseMove(this.item_4);
            })
			
			.capture('hovered_child', function (actions) {
				actions.mouseMove(this.item_15);
            })
    });
	
	gemini.suite('TreeDataGridView Hierarchy', function (test) {

        test.setUrl('/regression_items_action_online_25.html').setCaptureElements('html')

            .before(function (actions) {
				
				this.table = '[sbisname="TreeDataGridView 1"]';
				this.item_3 = '[data-id="3"]';
				this.item_10 = '[data-id="10"]';
				this.cut = '.controls-ItemActions__menu-container [data-id="cut"].controls-Menu__hasChild';
				this.menu_button = '.controls-ItemActions .controls-ItemActions__menu-button';
                
				actions.waitForElementToShow(this.table, 40000);
                actions.waitForElementToShow(this.item_3, 5000);
            })
			
			.capture('opened_menu', function (actions) {
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow(this.menu_button, 5000);
				actions.click(this.menu_button);
				actions.mouseMove(this.item_10);
				actions.waitForElementToShow(this.cut, 5000);
				actions.mouseMove(this.cut);
            })
    });
			
	gemini.suite('TreeCompositeViewList SelectionOnItemClick', function (test) {

        test.setUrl('/regression_items_action_online_26.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.table = '[sbisname="TreeDataGridView 1"]';
				this.data3 = '[data-id="3"]';	
				this.delete_icon = '.controls-ItemActions [data-id="delete"]';
                
				actions.waitForElementToShow(this.table, 40000);
                actions.waitForElementToShow(this.data3, 5000);
            })
			
			.capture('clicked_main_action', function (actions) {
				actions.mouseMove(this.data3);
				actions.waitForElementToShow(this.delete_icon, 5000);
				actions.click(this.delete_icon);
            })			
    });
	
	gemini.suite('TreeDataGridView LongItemName', function (test) {

        test.setUrl('/regression_items_action_online_27.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.table = '[sbisname="TreeDataGridView 1"]';
				this.data3 = '[data-id="3"]';	
				this.item_4 = '[data-id="4"]';	
				this.menu_button = '.controls-ItemActions .controls-ItemActions__menu-button';
				this.selected = '.controls-ListView__item__selected';
                
				actions.waitForElementToShow(this.table, 40000);
                actions.waitForElementToShow(this.data3, 5000);
            })
			
			.capture('opened_menu', function (actions) {
				actions.mouseMove(this.data3);
				actions.click(this.menu_button);
				actions.mouseMove(this.item_4);
				actions.waitForElementToShow(this.selected, 5000);
            })
    });
});