var path = require('path'),
    fs = require('fs'),
    nyc = require('nyc'),
    componentsPath = path.join(__dirname, 'components'),
    controlsPath = path.join(__dirname, 'Controls'),
    coveragePath = path.join(__dirname, 'artifacts', 'coverage.json'),
    coverageControlsPath = path.join(__dirname, 'artifacts', 'coverage', 'controls', 'coverage.json'),
    coverageComponentsPath = path.join(__dirname, 'artifacts', 'coverage', 'components', 'coverage.json'),
    allFiles = [];

dirWalker = function (dir) {
    var pattern = /\.js$/,
        files = fs.readdirSync(dir),
        newPath = '';
    for (var i = 0; i < files.length; i++) {
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

dirWalker(componentsPath);
dirWalker(controlsPath);

var rawCover = fs.readFileSync(coveragePath, 'utf8'),
    cover = JSON.parse(rawCover),
    instrumenter = new istanbul.Instrumenter(),
    transformer = instrumenter.instrumentSync.bind(instrumenter);

allFiles.forEach(function (name) {
    if (!cover[name]) {
        var rawFile = fs.readFileSync(name, 'utf-8');
        transformer(rawFile, name);
        Object.keys(instrumenter.coverState.s).forEach(function (key) {
            instrumenter.coverState.s[key] = 0;
        });
        cover[name] = instrumenter.coverState;
        console.log('File ' + name.replace(__dirname, '').slice(1) + ' not using in tests')
    }
});

fs.writeFileSync(coveragePath, JSON.stringify(cover), 'utf8');

function getCoverByPath(path) {
    var coverageByPath = {};
    Object.keys(cover).forEach(function (name) {
        if (name.includes(path)) {
            coverageByPath[name] = cover[name]
        }
    });
    return coverageByPath
}

var componentsCoverage = getCoverByPath(componentsPath),
    controlsCoverage = getCoverByPath(controlsPath);

fs.writeFileSync(coverageControlsPath, JSON.stringify(controlsCoverage), 'utf8');
fs.writeFileSync(coverageComponentsPath, JSON.stringify(componentsCoverage), 'utf8');