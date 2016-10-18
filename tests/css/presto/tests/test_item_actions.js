/*
var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.ItemsAction Online', function () {

    gemini.suite('TreeCompositeViewTable', function (test) {

        test.setUrl('/regression_items_action_online.html').setCaptureElements('.capture')

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

	gemini.suite('TreeDataGridView', function (test) {

        test.setUrl('/regression_items_action_online_8.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="TreeDataGridView 1"]', 40000);
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

	gemini.suite('TreeCompositeViewTable Item Lenght', function (test) {

        test.setUrl('/regression_items_action_online_9.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="TreeCompositeView 1"]', 40000);
                actions.waitForElementToShow('[data-id="3"]', 1000);
				this.item_3 = find('[data-id="3"]')
				actions.waitForElementToShow('[data-id="4"]', 1000);
				this.item_4 = find('[data-id="4"]')				
            })

			.capture('with_read_item', function (actions, find) {
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
            })

			.capture('with_read_item', function (actions, find) {
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
            })

			.capture('with_read_item', function (actions, find) {
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
            })

			.capture('with_read_item', function (actions, find) {
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
            })

			.capture('with_read_item', function (actions, find) {
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
            })

			.capture('with_read_item', function (actions, find) {
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
            })

			.capture('with_read_item', function (actions, find) {
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
            })

			.capture('with_read_item', function (actions, find) {
				actions.mouseMove(this.item_3);
				actions.waitForElementToShow('.controls-ItemActions .controls-ItemActions__menu-button', 1000);
				this.menu_button = find('.controls-ItemActions .controls-ItemActions__menu-button');
				actions.click(this.menu_button);
				actions.waitForElementToShow('.controls-Menu__Popup .controls-MenuItem[data-id="delete"]', 1000);
				actions.waitForElementToShow('.controls-PopupMixin__closeButton', 1000);
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
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
				this.close_button = find('.controls-PopupMixin__closeButton');
				actions.mouseMove(this.close_button);
            })
    });	
});*/