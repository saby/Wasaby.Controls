let path = require('path'),
    fs = require('fs'),
    nyc = require('nyc'),
    controlsPath = path.join(__dirname, 'Controls'),
    filePath = path.join(__dirname, 'File'),
    componentsPath = path.join(__dirname, 'components'),
    coveragePath = path.join(__dirname, 'artifacts', 'coverage.json'),
    coverageAllPath = path.join(__dirname, 'artifacts', 'coverageAll.json'),
    coverageControlsPath = path.join(__dirname, 'artifacts', 'coverageControls.json'),
    coverageFilePath = path.join(__dirname, 'artifacts', 'coverageFile.json'),
    coverageComponentsPath = path.join(__dirname, 'artifacts', 'coverageComponents.json'),
    allFiles = [];

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

dirWalker(controlsPath);
dirWalker(filePath);
dirWalker(componentsPath);

let rawCover = fs.readFileSync(coveragePath, 'utf8'),
    cover = JSON.parse(rawCover),
    newCover = {},
    instrumenter = new nyc().instrumenter(),
    transformer = instrumenter.instrumentSync.bind(instrumenter),
    controlsFiles = allFiles.filter(file => file.includes('Controls')),
    fileFiles = allFiles.filter(file => file.includes('File')),
    componentsFiles = allFiles.filter(file => file.includes('components'));

function coverFiles(files, replacer) {
    files.forEach(file => {
        let relPath = file.replace(replacer, '').slice(1),
            rootPaths = replacer.split(path.sep),
            rootDir = rootPaths[rootPaths.length - 1],
            key = [rootDir, relPath].join(path.sep),
            coverData = cover[key];
        if (!coverData) {
            let rawFile = fs.readFileSync(file, 'utf-8');
            transformer(rawFile, file);
            let coverState = instrumenter.lastFileCoverage();
            Object.keys(coverState.s).forEach(key => coverState.s[key] = 0);
            newCover[file] = coverState;
            console.log('File ' + file + ' not using in tests')
        } else {
            coverData['path'] = file;
            newCover[file] = coverData;
        }
    });
}

coverFiles(controlsFiles, controlsPath);
coverFiles(fileFiles, filePath);
coverFiles(componentsFiles, componentsPath);

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
    fileCoverage = getCoverByPath(filePath),
    componentsCoverage = getCoverByPath(componentsPath);

fs.writeFileSync(coverageAllPath, JSON.stringify(newCover), 'utf8');
fs.writeFileSync(coverageControlsPath, JSON.stringify(controlsCoverage), 'utf8');
fs.writeFileSync(coverageFilePath, JSON.stringify(fileCoverage), 'utf8');
fs.writeFileSync(coverageComponentsPath, JSON.stringify(componentsCoverage), 'utf8');