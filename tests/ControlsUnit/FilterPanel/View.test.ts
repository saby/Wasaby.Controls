import {View} from 'Controls/filterPanel';
import {assert} from 'chai';

describe('Controls/filterPanel:View', () => {

    describe('_groupClick', () => {
        const viewControl = new View({});
        let itemToggled = false;
        const displayItem = {
            getContents: () => 'elem',
            toggleExpanded: () => { itemToggled = true; }
        };
        const clickEvent = {
            target: {
                closest: (text) => {
                    return text === '.controls-FilterViewPanel__group';
                }
            }
        };

        it('displayItem is expanded', () => {
            viewControl._collapsedGroups = ['elem'];

            viewControl._groupClick(null, displayItem, clickEvent);
            assert.deepEqual(viewControl._collapsedGroups, []);
            assert.isTrue(itemToggled);
        });

        it('collapsedGroups includes item contents', () => {
            itemToggled = false;
            viewControl._collapsedGroups = ['elem'];

            viewControl._groupClick(null, displayItem, clickEvent);
            assert.deepEqual(viewControl._collapsedGroups, []);
            assert.isTrue(itemToggled);
        });

        it('displayItem is collapsed', () => {
            itemToggled = false;
            viewControl._collapsedGroups = [];

            viewControl._groupClick(null, displayItem, clickEvent);
            assert.deepEqual(viewControl._collapsedGroups, ['elem']);
            assert.isTrue(itemToggled);
        });
    });

    describe('_resetFilter', () => {
        const viewControl = new View({});
        viewControl._beforeMount({
            source: [{
                name: 'test',
                value: 'test',
                textValue: 'test'
            }]
        });

        it('_setSource was called', () => {
            let sourceUpdated = false;
            viewControl._setSource = () => {
                sourceUpdated = true;
            };
            viewControl._resetFilter();
            assert.isTrue(sourceUpdated);
        });
    });
});
