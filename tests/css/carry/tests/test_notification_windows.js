gemini.suite('SBIS3.CONTROLS.NotificationWindows Carry', function () {

    gemini.suite('success_dialog', function (test) {

        test.setUrl('/regression_info_windows_carry.html').setCaptureElements('html')

            .before(function (actions) {
                
				this.success = '.butt1';				
                this.error = '.butt2';
                this.custom = '.butt2_cust';
                this.message = '.butt3';
                this.longops = '.butt4';
                this.yes_no = '.butt5';
                this.yes_no_cancel = '.butt6';
                this.green = '.butt7';
                this.red = '.butt8';
				this.caption = '.controls-NotificationPopup__header_caption';
				this.img1 = '.message img';
				this.img2 = '.longops img';
				this.ok = '[sbisname="okButton"]';
				this.pos = '[sbisname="positiveButton"]';
                
				actions.waitForElementToShow(this.success, 40000);
				actions.waitForElementToShow(this.error, 5000);
				actions.waitForElementToShow(this.custom, 5000);
				actions.waitForElementToShow(this.message, 5000);
				actions.waitForElementToShow(this.longops, 5000);
				actions.waitForElementToShow(this.yes_no, 5000);
				actions.waitForElementToShow(this.yes_no_cancel, 5000);
				actions.waitForElementToShow(this.green, 5000);
				actions.waitForElementToShow(this.red, 5000);
            })

            .capture('plain', function (actions) {
				actions.click(this.success)
				actions.waitForElementToShow(this.caption, 5000)
            })			
    });

	gemini.suite('error_dialog', function (test) {

        test.setUrl('/regression_info_windows_carry.html').setCaptureElements('html')

            .before(function (actions) {
                
				this.success = '.butt1';				
                this.error = '.butt2';
                this.custom = '.butt2_cust';
                this.message = '.butt3';
                this.longops = '.butt4';
                this.yes_no = '.butt5';
                this.yes_no_cancel = '.butt6';
                this.green = '.butt7';
                this.red = '.butt8';
				this.caption = '.controls-NotificationPopup__header_caption';
				this.img1 = '.message img';
				this.img2 = '.longops img';
				this.ok = '[sbisname="okButton"]';
				this.pos = '[sbisname="positiveButton"]';
                
				actions.waitForElementToShow(this.success, 40000);
				actions.waitForElementToShow(this.error, 5000);
				actions.waitForElementToShow(this.custom, 5000);
				actions.waitForElementToShow(this.message, 5000);
				actions.waitForElementToShow(this.longops, 5000);
				actions.waitForElementToShow(this.yes_no, 5000);
				actions.waitForElementToShow(this.yes_no_cancel, 5000);
				actions.waitForElementToShow(this.green, 5000);
				actions.waitForElementToShow(this.red, 5000);
            })
			
			.capture('plain', function (actions) {
				actions.click(this.error)
				actions.waitForElementToShow(this.caption, 5000)
            })			
    });

	gemini.suite('custom_icon_dialog', function (test) {

        test.setUrl('/regression_info_windows_carry.html').setCaptureElements('html')

            .before(function (actions) {
                
				this.success = '.butt1';				
                this.error = '.butt2';
                this.custom = '.butt2_cust';
                this.message = '.butt3';
                this.longops = '.butt4';
                this.yes_no = '.butt5';
                this.yes_no_cancel = '.butt6';
                this.green = '.butt7';
                this.red = '.butt8';
				this.caption = '.controls-NotificationPopup__header_caption';
				this.img1 = '.message img';
				this.img2 = '.longops img';
				this.ok = '[sbisname="okButton"]';
				this.pos = '[sbisname="positiveButton"]';
                
				actions.waitForElementToShow(this.success, 40000);
				actions.waitForElementToShow(this.error, 5000);
				actions.waitForElementToShow(this.custom, 5000);
				actions.waitForElementToShow(this.message, 5000);
				actions.waitForElementToShow(this.longops, 5000);
				actions.waitForElementToShow(this.yes_no, 5000);
				actions.waitForElementToShow(this.yes_no_cancel, 5000);
				actions.waitForElementToShow(this.green, 5000);
				actions.waitForElementToShow(this.red, 5000);
            })
			
			.capture('plain', function (actions) {
				actions.click(this.custom)
				actions.waitForElementToShow(this.caption, 5000)
            })			
    });

	gemini.suite('message_dialog', function (test) {

        test.setUrl('/regression_info_windows_carry.html').setCaptureElements('html')

            .before(function (actions) {
                
				this.success = '.butt1';				
                this.error = '.butt2';
                this.custom = '.butt2_cust';
                this.message = '.butt3';
                this.longops = '.butt4';
                this.yes_no = '.butt5';
                this.yes_no_cancel = '.butt6';
                this.green = '.butt7';
                this.red = '.butt8';
				this.caption = '.controls-NotificationPopup__header_caption';
				this.img1 = '.message img';
				this.img2 = '.longops img';
				this.ok = '[sbisname="okButton"]';
				this.pos = '[sbisname="positiveButton"]';
                
				actions.waitForElementToShow(this.success, 40000);
				actions.waitForElementToShow(this.error, 5000);
				actions.waitForElementToShow(this.custom, 5000);
				actions.waitForElementToShow(this.message, 5000);
				actions.waitForElementToShow(this.longops, 5000);
				actions.waitForElementToShow(this.yes_no, 5000);
				actions.waitForElementToShow(this.yes_no_cancel, 5000);
				actions.waitForElementToShow(this.green, 5000);
				actions.waitForElementToShow(this.red, 5000);
            })
			
			.capture('plain', function (actions) {
				actions.click(this.message)
				actions.waitForElementToShow(this.img1, 5000)
            })			
    });

	gemini.suite('green_dialog', function (test) {

        test.setUrl('/regression_info_windows_carry.html').setCaptureElements('html')

            .before(function (actions) {
                
				this.success = '.butt1';				
                this.error = '.butt2';
                this.custom = '.butt2_cust';
                this.message = '.butt3';
                this.longops = '.butt4';
                this.yes_no = '.butt5';
                this.yes_no_cancel = '.butt6';
                this.green = '.butt7';
                this.red = '.butt8';
				this.caption = '.controls-NotificationPopup__header_caption';
				this.img1 = '.message img';
				this.img2 = '.longops img';
				this.ok = '[sbisname="okButton"]';
				this.pos = '[sbisname="positiveButton"]';
                
				actions.waitForElementToShow(this.success, 40000);
				actions.waitForElementToShow(this.error, 5000);
				actions.waitForElementToShow(this.custom, 5000);
				actions.waitForElementToShow(this.message, 5000);
				actions.waitForElementToShow(this.longops, 5000);
				actions.waitForElementToShow(this.yes_no, 5000);
				actions.waitForElementToShow(this.yes_no_cancel, 5000);
				actions.waitForElementToShow(this.green, 5000);
				actions.waitForElementToShow(this.red, 5000);
            })
			
			.capture('plain', function (actions) {
				actions.click(this.green)
				actions.waitForElementToShow(this.ok, 5000)

            })			
    });


	gemini.suite('red_dialog', function (test) {

        test.setUrl('/regression_info_windows_carry.html').setCaptureElements('html')

            .before(function (actions) {
                
				this.success = '.butt1';				
                this.error = '.butt2';
                this.custom = '.butt2_cust';
                this.message = '.butt3';
                this.longops = '.butt4';
                this.yes_no = '.butt5';
                this.yes_no_cancel = '.butt6';
                this.green = '.butt7';
                this.red = '.butt8';
				this.caption = '.controls-NotificationPopup__header_caption';
				this.img1 = '.message img';
				this.img2 = '.longops img';
				this.ok = '[sbisname="okButton"]';
				this.pos = '[sbisname="positiveButton"]';
                
				actions.waitForElementToShow(this.success, 40000);
				actions.waitForElementToShow(this.error, 5000);
				actions.waitForElementToShow(this.custom, 5000);
				actions.waitForElementToShow(this.message, 5000);
				actions.waitForElementToShow(this.longops, 5000);
				actions.waitForElementToShow(this.yes_no, 5000);
				actions.waitForElementToShow(this.yes_no_cancel, 5000);
				actions.waitForElementToShow(this.green, 5000);
				actions.waitForElementToShow(this.red, 5000);
            })

			.capture('plain', function (actions) {
				actions.click(this.red)
				actions.waitForElementToShow(this.ok, 5000)
            })
    });

	gemini.suite('yes_no_dialog', function (test) {

        test.setUrl('/regression_info_windows_carry.html').setCaptureElements('html')

            .before(function (actions) {
                
				this.success = '.butt1';				
                this.error = '.butt2';
                this.custom = '.butt2_cust';
                this.message = '.butt3';
                this.longops = '.butt4';
                this.yes_no = '.butt5';
                this.yes_no_cancel = '.butt6';
                this.green = '.butt7';
                this.red = '.butt8';
				this.caption = '.controls-NotificationPopup__header_caption';
				this.img1 = '.message img';
				this.img2 = '.longops img';
				this.ok = '[sbisname="okButton"]';
				this.pos = '[sbisname="positiveButton"]';
                
				actions.waitForElementToShow(this.success, 40000);
				actions.waitForElementToShow(this.error, 5000);
				actions.waitForElementToShow(this.custom, 5000);
				actions.waitForElementToShow(this.message, 5000);
				actions.waitForElementToShow(this.longops, 5000);
				actions.waitForElementToShow(this.yes_no, 5000);
				actions.waitForElementToShow(this.yes_no_cancel, 5000);
				actions.waitForElementToShow(this.green, 5000);
				actions.waitForElementToShow(this.red, 5000);
            })

			.capture('plain', function (actions) {
				actions.click(this.yes_no)
				actions.waitForElementToShow(this.pos, 5000)
            })
    });

	gemini.suite('yes_no_cancel_dialog', function (test) {

        test.setUrl('/regression_info_windows_carry.html').setCaptureElements('html')

            .before(function (actions) {
                
				this.success = '.butt1';				
                this.error = '.butt2';
                this.custom = '.butt2_cust';
                this.message = '.butt3';
                this.longops = '.butt4';
                this.yes_no = '.butt5';
                this.yes_no_cancel = '.butt6';
                this.green = '.butt7';
                this.red = '.butt8';
				this.caption = '.controls-NotificationPopup__header_caption';
				this.img1 = '.message img';
				this.img2 = '.longops img';
				this.ok = '[sbisname="okButton"]';
				this.pos = '[sbisname="positiveButton"]';
                
				actions.waitForElementToShow(this.success, 40000);
				actions.waitForElementToShow(this.error, 5000);
				actions.waitForElementToShow(this.custom, 5000);
				actions.waitForElementToShow(this.message, 5000);
				actions.waitForElementToShow(this.longops, 5000);
				actions.waitForElementToShow(this.yes_no, 5000);
				actions.waitForElementToShow(this.yes_no_cancel, 5000);
				actions.waitForElementToShow(this.green, 5000);
				actions.waitForElementToShow(this.red, 5000);
            })

			.capture('plain', function (actions) {
				actions.click(this.yes_no_cancel)
				actions.waitForElementToShow(this.pos, 5000)
            })
    });
});