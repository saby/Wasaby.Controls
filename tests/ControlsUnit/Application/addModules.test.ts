import { assert } from 'chai';
import { PrefetchLinksStore } from 'UI/Base';
import * as CApp from 'Controls/Application';

const prefetchModule = 'Module/File';
const pls = new PrefetchLinksStore();
describe('Controls/Application addModules', () => {
    it('addPrefetchModules', () => {
        CApp.addPrefetchModules([prefetchModule]);
        const modules = pls.getPrefetchModules();
        assert.equal(modules.length, 1);
        assert.equal(modules[0], prefetchModule);
    });

    it('addPreloadModules', () => {
        CApp.addPreloadModules([prefetchModule]);
        const modules = pls.getPreloadModules();
        assert.equal(modules.length, 1);
        assert.equal(modules[0], prefetchModule);
    });
});
