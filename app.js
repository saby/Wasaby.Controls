'use strict';
var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    spawn = require('child_process').spawn,
    bodyParser = require('body-parser'),
    app = express();

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname)));

app.listen(process.env.PORT || 666);

console.log('app available on port 666');
console.log('collecting deps...');

var collectDeps = spawn('node', ['depencyCollector']);

collectDeps.stdout.pipe(process.stdout);
collectDeps.stderr.pipe(process.stderr);
collectDeps.on('close', function(code) {
    console.log('deps collected successfuly');
});

// Кошерный редирект на CDN, который РАБОТАЕТ
app.get('/cdn*', function(req, res) {
  res.redirect('https://test-inside.tensor.ru' + req.url);
});

app.post('/theme-preview/get-theme/', function(req, res)  {
  req.on('data', function(data) {
        var themeName = JSON.parse(data.toString()).name;
        if (!themeName) {
            res.send('err occured');
        }
        fs.readFile(process.cwd() + '/themes/' + themeName + '/variables.less', function(err, data) {
            res.send(data);
        });
    });
});

app.post('/theme-preview/apply-theme/', function(req, res)  {
    req.on('data', function(data) {
        var themeName = JSON.parse(data.toString()).themeName;
        var newRules = JSON.parse(data.toString()).rules;
        var variablesPath = process.cwd() +  '/themes/online/variables.less';
        fs.readFile(variablesPath, function(err, data) {
            var stringData = data.toString();
            for (var i in newRules) {
                var reg = new RegExp('@' + i + ':\\s+\\S+');
                stringData = stringData.replace(reg, '@' + i + ':      ' + newRules[i] + ';');
            };
            fs.writeFile(variablesPath, stringData, function(err) {
                if (err) {
                    console.error(err);
                }
                var grunt = spawn('grunt', ['css', '--theme=online']);
                grunt.stdout.pipe(process.stdout);
                grunt.stderr.pipe(process.stderr);
                grunt.on('close', function(code) {
                    console.log('child process exited with code: ' +  code);
                    res.send('фсё')
                });
            })
        });
    })
})
