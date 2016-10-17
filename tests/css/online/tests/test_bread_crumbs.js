gemini.suite('SBIS3.CONTROLS.BreadCrumbs Online', function () {
	
    gemini.suite('base', function (test) {

        test.setUrl('/regression_bread_crumbs_online.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.tdgv = '[name="TreeDataGridView 1"]';
				this.item4 = '[data-id="4"]';
                this.item13 = '[data-id="13"]';
				this.item14 = '[data-id="14"]';
				this.item21 = '[data-id="21"]';
                this.home = '.icon-Home3';
                this.title = '.controls-BreadCrumbs__title';
                
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.item4, 5000);
            })

            .capture('plain')
			
			.capture('into_folder', function (actions) {
                actions.click(this.item4);
				actions.waitForElementToShow(this.item14, 5000);
                actions.click(this.item13)
				actions.waitForElementToShow(this.item21, 5000);
				actions.waitForElementToShow(this.title, 5000);
            })

            .capture('hovered_home', function (actions) {
                actions.mouseMove(this.home);
            })

            .capture('hovered_title', function (actions) {
                actions.mouseMove(this.title);
            })
    });

    gemini.suite('small_items', function (test) {

        test.setUrl('/regression_bread_crumbs_online_3.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.tdgv = '[name="TreeDataGridView 1"]';
				this.item4 = '[data-id="4"]';
                this.item13 = '[data-id="13"]';
				this.item14 = '[data-id="14"]';
				this.item21 = '[data-id="21"]';
                this.home = '.icon-Home3';
                this.title = '.controls-BreadCrumbs__title';
                
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.item4, 5000);
            })

            .capture('plain', function (actions) {
                actions.click(this.item4);
				actions.waitForElementToShow(this.item14, 5000);
                actions.click(this.item13)
				actions.waitForElementToShow(this.item21, 5000);
				actions.waitForElementToShow(this.title, 5000);
            })
    });
	
    gemini.suite('dots', function (test) {

        test.setUrl('/regression_bread_crumbs_online_2.html').setCaptureElements('.capture')

            .before(function (actions) {

				this.tdgv = '[name="TreeDataGridView 1"]';
				this.item4 = '[data-id="4"]';
                this.item13 = '[data-id="13"]';
				this.item14 = '[data-id="14"]';
				this.item21 = '[data-id="21"]';
				this.item22 = '[data-id="22"]';
                this.home = '.icon-Home3';
                this.title = '.controls-BreadCrumbs__title';
				this.title = '.controls-BreadCrumbs__title';
                this.dots = '.controls-BreadCrumbs__dots';
                this.dot_item1 = '.controls-BreadCrumbs .controls-MenuItem:nth-child(1)';
                
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.item4, 5000);
            })

            .capture('plain', function (actions) {
				actions.click(this.item4);
				actions.waitForElementToShow(this.item14, 5000);
                actions.click(this.item13);
				actions.waitForElementToShow(this.item21, 5000);
                actions.click(this.item21);
				actions.waitForElementToShow(this.item22, 5000);
                actions.click(this.item22);
			})

            .capture('hovered_dots', function (actions) {
                actions.mouseMove(this.dots);
            })
			
			.capture('opened_dots', function (actions) {
                actions.click(this.dots);
				actions.waitForElementToShow(this.dot_item1, 5000);
            })
			
			.capture('disabled', function (actions) {
				actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('BreadCrumbs 55').setEnabled(false);
                });
			})
			
			.capture('hovered_home_icon', function (actions) {
				actions.mouseMove(this.home);
			})
			
			.capture('hovered_text', function (actions) {
				actions.mouseMove(this.title);
			})
    });
	
	gemini.suite('have_titles', function (test) {

        test.setUrl('/regression_engine_browser_online_2.html').setCaptureElements('.capture')

            .before(function (actions) {
                
				this.view = '[sbisname="browserView"]';
                this.input = '[sbisname="TextBox 1"] input';
				this.caption = '[sbisname="BackButton-caption"]';
				this.dots = '.controls-BreadCrumbs__dots';
				this.d1 = 'div.js-controls-BreadCrumbs__crumb:nth-child(1)';
				this.d2 = 'div.js-controls-BreadCrumbs__crumb:nth-child(2)';
				this.d3 = 'div.js-controls-BreadCrumbs__crumb:nth-child(3)';
				this.d4 = 'div.js-controls-BreadCrumbs__crumb:nth-child(3) .controls-BreadCrumbs__hierWrapper:nth-child(2)';
                
				actions.waitForElementToShow(this.view, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('into_folder', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('browserView').setCurrentRoot(33);
					window.$ws.single.ControlStorage.getByName('browserView').reload();
                });
				actions.waitForElementToShow(this.caption, 5000);
            })
			
			.capture('opened_dots', function (actions) {                
				actions.click(this.dots);
				actions.waitForElementToShow(this.d1, 5000);
				actions.waitForElementToShow(this.d2, 5000);
				actions.waitForElementToShow(this.d3, 5000);
				actions.waitForElementToShow(this.d4, 5000);
            })
    });
	
	gemini.suite('have_titles_and_height_24', function (test) {

        test.setUrl('/regression_engine_browser_online_3.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.view = '[sbisname="browserView"]';
                this.input = '[sbisname="TextBox 1"] input';
				this.caption = '[sbisname="BackButton-caption"]';
				this.dots = '.controls-BreadCrumbs__dots';
				this.d1 = 'div.js-controls-BreadCrumbs__crumb:nth-child(1)';
				this.d2 = 'div.js-controls-BreadCrumbs__crumb:nth-child(2)';
				this.d3 = 'div.js-controls-BreadCrumbs__crumb:nth-child(3)';
				this.d4 = 'div.js-controls-BreadCrumbs__crumb:nth-child(3) .controls-BreadCrumbs__hierWrapper:nth-child(2)';
                
				actions.waitForElementToShow(this.view, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('into_folder', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('browserView').setCurrentRoot(33);
					window.$ws.single.ControlStorage.getByName('browserView').reload();
                });
				actions.waitForElementToShow(this.caption, 5000);
            })
			
			.capture('opened_dots', function (actions) {
				actions.click(this.dots);
				actions.waitForElementToShow(this.d1, 5000);
				actions.waitForElementToShow(this.d2, 5000);
				actions.waitForElementToShow(this.d3, 5000);
				actions.waitForElementToShow(this.d4, 5000);
            })
    });
	
	gemini.suite('have_titles_and_height_25', function (test) {

        test.setUrl('/regression_engine_browser_online_4.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.view = '[sbisname="browserView"]';
                this.input = '[sbisname="TextBox 1"] input';
				this.caption = '[sbisname="BackButton-caption"]';
				this.dots = '.controls-BreadCrumbs__dots';
				this.d1 = 'div.js-controls-BreadCrumbs__crumb:nth-child(1)';
				this.d2 = 'div.js-controls-BreadCrumbs__crumb:nth-child(2)';
				this.d3 = 'div.js-controls-BreadCrumbs__crumb:nth-child(3)';
				this.d4 = 'div.js-controls-BreadCrumbs__crumb:nth-child(3) .controls-BreadCrumbs__hierWrapper:nth-child(2)';
                
				actions.waitForElementToShow(this.view, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('into_folder', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('browserView').setCurrentRoot(33);
					window.$ws.single.ControlStorage.getByName('browserView').reload();
                });
				actions.waitForElementToShow(this.caption, 5000);
            })
			
			.capture('opened_dots', function (actions) {
				actions.click(this.dots);
				actions.waitForElementToShow(this.d1, 5000);
				actions.waitForElementToShow(this.d2, 5000);
				actions.waitForElementToShow(this.d3, 5000);
				actions.waitForElementToShow(this.d4, 5000);
            })
    });
	
	gemini.suite('have_all_titles_and_height_25', function (test) {

        test.setUrl('/regression_engine_browser_online_11.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.view = '[sbisname="browserView"]';
                this.input = '[sbisname="TextBox 1"] input';
				this.caption = '[sbisname="BackButton-caption"]';
                
				actions.waitForElementToShow(this.view, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('into_folder', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('browserView').setCurrentRoot(33);
					window.$ws.single.ControlStorage.getByName('browserView').reload();
                });
				actions.waitForElementToShow(this.caption, 5000);
            })
    });
	
	gemini.suite('have_atitles_and_height_25_and_part_scroll', function (test) {

        test.setUrl('/regression_engine_browser_online_13.html').setCaptureElements('html')

            .before(function (actions) {
				
				this.view = '[sbisname="browserView"]';
                this.input = '[sbisname="TextBox 1"] input';
				this.caption = '[sbisname="BackButton-caption"]';
				this.data2 = '[data-id="2"]';
				this.data4 = '[data-id="4"]';
				this.data31 = '[data-id="31"]';
				this.thumb = '.controls-DataGridView__PartScroll__thumb';
                
				actions.waitForElementToShow(this.view, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('into_folder', function (actions) {
                actions.click(this.data2);
				actions.waitForElementToShow(this.data4, 5000);
				actions.waitForElementToShow(this.data31, 5000);
				actions.waitForElementToShow(this.thumb, 5000);
				actions.waitForElementToShow(this.caption, 5000);
            })
    });
	
	gemini.suite('have_no_titles', function (test) {

        test.setUrl('/regression_engine_browser_online_5.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.view = '[sbisname="browserView"]';
                this.input = '[sbisname="TextBox 1"] input';
				this.caption = '[sbisname="BackButton-caption"]';
				this.dots = '.controls-BreadCrumbs__dots';
				this.d1 = 'div.js-controls-BreadCrumbs__crumb:nth-child(1)';
				this.d2 = 'div.js-controls-BreadCrumbs__crumb:nth-child(2)';
				this.d3 = 'div.js-controls-BreadCrumbs__crumb:nth-child(3)';
				this.d4 = 'div.js-controls-BreadCrumbs__crumb:nth-child(3) .controls-BreadCrumbs__hierWrapper:nth-child(2)';
                
				actions.waitForElementToShow(this.view, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('into_folder', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('browserView').setCurrentRoot(33);
					window.$ws.single.ControlStorage.getByName('browserView').reload();
                });
				actions.waitForElementToShow(this.caption, 5000);
            })
			
			.capture('opened_dots', function (actions) {
				actions.click(this.dots);
				actions.waitForElementToShow(this.d1, 5000);
				actions.waitForElementToShow(this.d2, 5000);
				actions.waitForElementToShow(this.d3, 5000);
				actions.waitForElementToShow(this.d4, 5000);
            })
    });
	
	gemini.suite('have_notitles_and_height_24', function (test) {

        test.setUrl('/regression_engine_browser_online_6.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.view = '[sbisname="browserView"]';
                this.input = '[sbisname="TextBox 1"] input';
				this.caption = '[sbisname="BackButton-caption"]';
				this.dots = '.controls-BreadCrumbs__dots';
				this.d1 = 'div.js-controls-BreadCrumbs__crumb:nth-child(1)';
				this.d2 = 'div.js-controls-BreadCrumbs__crumb:nth-child(2)';
				this.d3 = 'div.js-controls-BreadCrumbs__crumb:nth-child(3)';
				this.d4 = 'div.js-controls-BreadCrumbs__crumb:nth-child(3) .controls-BreadCrumbs__hierWrapper:nth-child(2)';
                
				actions.waitForElementToShow(this.view, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('into_folder', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('browserView').setCurrentRoot(33);
					window.$ws.single.ControlStorage.getByName('browserView').reload();
                });
				actions.waitForElementToShow(this.caption, 5000);
            })
			
			.capture('opened_dots', function (actions) {
				actions.click(this.dots);
				actions.waitForElementToShow(this.d1, 5000);
				actions.waitForElementToShow(this.d2, 5000);
				actions.waitForElementToShow(this.d3, 5000);
				actions.waitForElementToShow(this.d4, 5000);
            })
    });
	
	gemini.suite('have_notitles_and_height_25', function (test) {

        test.setUrl('/regression_engine_browser_online_7.html').setCaptureElements('.capture')

            .before(function (actions) {
				
				this.view = '[sbisname="browserView"]';
                this.input = '[sbisname="TextBox 1"] input';
				this.caption = '[sbisname="BackButton-caption"]';
				this.dots = '.controls-BreadCrumbs__dots';
				this.d1 = 'div.js-controls-BreadCrumbs__crumb:nth-child(1)';
				this.d2 = 'div.js-controls-BreadCrumbs__crumb:nth-child(2)';
				this.d3 = 'div.js-controls-BreadCrumbs__crumb:nth-child(3)';
				this.d4 = 'div.js-controls-BreadCrumbs__crumb:nth-child(3) .controls-BreadCrumbs__hierWrapper:nth-child(2)';
                
				actions.waitForElementToShow(this.view, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('into_folder', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('browserView').setCurrentRoot(33);
					window.$ws.single.ControlStorage.getByName('browserView').reload();
                });
				actions.waitForElementToShow(this.caption, 5000);
            })
			
			.capture('opened_dots', function (actions) {
				actions.click(this.dots);
				actions.waitForElementToShow(this.d1, 5000);
				actions.waitForElementToShow(this.d2, 5000);
				actions.waitForElementToShow(this.d3, 5000);
				actions.waitForElementToShow(this.d4, 5000);
            })
    });

    gemini.suite('without_table_head', function (test) {

        test.setUrl('/regression_engine_browser_online_4.html').setCaptureElements('.capture')

            .before(function (actions) {

				this.view = '[sbisname="browserView"]';
                this.input = '[sbisname="TextBox 1"] input';
				this.data3 = '[data-id="3"]';
				this.data5 = '[data-id="5"]';
				this.caption = '[sbisname="BackButton-caption"]';
                
				actions.waitForElementToShow(this.view, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('plain', function (actions) {
				actions.click(this.data3);
				actions.waitForElementToShow(this.caption, 5000);
            })

            .capture('without_table_head', function (actions) {
                actions.executeJS(function (window) {
                    $ws.single.ControlStorage.getByName('browserView')._options.showHead = false
					$ws.single.ControlStorage.getByName('browserView')._redrawHead();
                });
				actions.waitForElementToShow(this.caption, 5000);
            })

			.capture('into_folder', function (actions) {
                actions.click(this.data5);
				actions.waitForElementToShow(this.caption, 5000);
            })
    });
});