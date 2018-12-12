let path = require('path'),
    fs = require('fs'),
    nyc = require('nyc'),
    controlsPath = path.join(__dirname, 'Controls'),
    componentsPath = path.join(__dirname, 'SBIS3.CONTROLS'),
    coveragePath = path.join(__dirname, 'application', 'artifacts', 'coverage.json'),
    coverageAllPath = path.join(__dirname, 'artifacts', 'coverageAll.json'),
    coverageControlsPath = path.join(__dirname, 'artifacts', 'coverageControls.json'),
    coverageFilePath = path.join(__dirname, 'artifacts', 'coverageFile.json'),
    coverageComponentsPath = path.join(__dirname, 'artifacts', 'coverageComponents.json'),
    allFiles = [];

// функция пробегает по папке и находит все js файлы
dirWalker = function (dir) {
    let pattern = /\.js$/,
        files = fs.readdirSync(dir),
        newPath = '';
    for (let i = 0; i < files.length; i++) {
        newPath = path.join(dir, files[i]);
        if (fs.statSync(newPath).isDirectory()) {
            dirWalker(newPath);
        } else {
            if (pattern.test(files[i])) {
                allFiles.push(newPath);
            }
        }
    }
};

// пробегаем по папкам Controls, Components
dirWalker(controlsPath);
dirWalker(componentsPath);

let rawCover = fs.readFileSync(coveragePath, 'utf8'),
    cover = JSON.parse(rawCover),
    newCover = {},
    instrumenter = new nyc().instrumenter(),
    transformer = instrumenter.instrumentSync.bind(instrumenter),
    controlsFiles = allFiles.filter(file => file.includes('/Controls/')),
    componentsFiles = allFiles.filter(file => file.includes('/SBIS3.CONTROLS/'));

// функция дописывает 0 покрытие для файлов которые не использовались в тестах
// и меняет относительные пути на абсолютные
function coverFiles(files, replacer) {
    files.forEach(file => {
        let relPath = file.replace(replacer, '').slice(1),
            rootPaths = replacer.split(path.sep),
            rootDir = rootPaths[rootPaths.length - 1],
            key = [rootDir, relPath].join(path.sep),
            coverData = cover[key];
        if (!coverData) {
            try {
                let rawFile = fs.readFileSync(file, 'utf-8');
                transformer(rawFile, file);
                let coverState = instrumenter.lastFileCoverage();
                Object.keys(coverState.s).forEach(key => coverState.s[key] = 0);
                newCover[file] = coverState;
                console.log('File ' + file.replace(__dirname, '').slice(1) + ' not using in tests')
            } catch (err) {
                console.log('File ' + file.replace(__dirname, '').slice(1) + ' can\'t be instrumented, pls try later');
            }
        } else {
            coverData['path'] = file;
            newCover[file] = coverData;
        }
    });
}

// дописываем 0 покрытия для файлов которые не использовались в тестах
coverFiles(controlsFiles, controlsPath);
coverFiles(componentsFiles, componentsPath);

// функция возвращает покрытие для опредленного пути
function getCoverByPath(path) {
    let coverageByPath = {};
    Object.keys(newCover).forEach(function (name) {
        if (name.includes(path)) {
            coverageByPath[name] = newCover[name]
        }
    });
    return coverageByPath
}

let controlsCoverage = getCoverByPath(controlsPath),
    componentsCoverage = getCoverByPath(componentsPath);

// сохраняем покрытие Общее, Controls, components
fs.writeFileSync(coverageAllPath, JSON.stringify(newCover), 'utf8');
fs.writeFileSync(coverageControlsPath, JSON.stringify(controlsCoverage), 'utf8');
fs.writeFileSync(coverageComponentsPath, JSON.stringify(componentsCoverage), 'utf8');