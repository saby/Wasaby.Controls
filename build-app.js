const
    root = process.cwd(),
    fs = require('fs-extra'),
    path = require('path');

/**
 * Симличим основные мета-файлы билдера в resources.
 * Это связано с проблемами запроса данных файлов
 * серверной частью Controls/Application:
 * у облака на клиенте resourceRoot - это auth/resources
 * а не сервере - auth_ps/resources.
 * TODO надо добить данную проблему и спилить костыль.
 * https://online.sbis.ru/opendoc.html?guid=8a9a3195-6a05-4db5-a26d-2853a373eb7b
 * @returns {Promise<void>}
 */
async function postProcessBuilderOutput() {
   await fs.ensureDir(path.join(root, 'application', 'resources'));
   await fs.ensureSymlink(
      path.join(root, 'application', 'contents.json'),
      path.join(root, 'application', 'resources', 'contents.min.json')
   );
   await fs.ensureSymlink(
      path.join(root, 'application', 'contents.json'),
      path.join(root, 'application', 'resources', 'contents.json')
   );
}
postProcessBuilderOutput().then(() => console.log('build-app finished successfully'));