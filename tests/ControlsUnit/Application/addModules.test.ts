import { assert } from 'chai';
import { Head } from 'Application/Page';
import * as CApp from 'Controls/Application';

const modules = [
    'Module/File'
];
describe('Controls/Application addModules', () => {
    beforeEach(() => {
        Head.getInstance()._rawElements = {};
    });

    it('addPrefetchModules', () => {
        CApp.addPrefetchModules(modules);
        const data = Head.getInstance().getData();
        assert.equal(data.length, 1);
        assert.equal(data[0][0], 'link');
        assert.equal(data[0][1].rel, 'prefetch');
        assert.equal(data[0][1].href, modules[0]);
    });

    it('addPreloadModules', () => {
        CApp.addPreloadModules(modules);
        const data = Head.getInstance().getData();
        assert.equal(data.length, 1);
        assert.equal(data[0][0], 'link');
        assert.equal(data[0][1].rel, 'preload');
        assert.equal(data[0][1].href, modules[0]);
    });
});
