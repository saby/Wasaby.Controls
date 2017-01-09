const express = require('express'),
    path = require('path'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    app = express();

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../')));

app.listen(process.env.PORT || 4444);
console.log('theme-preview is available on port 4444');
console.log(`current dir is  ${process.cwd()}`)

app.get('/cdn*', function(req, res) {
    res.redirect(200, 'https://test-inside.tensor.ru/cdn/');
});

app.post('/theme-preview/get-theme/', (req, res) => {

    req.on('data', data => {


        let themeName = JSON.parse(data.toString()).name;
        if (!themeName) {
            res.send('err occured');
        }
        let themeVariables = fs.readFile(`${process.cwd()}/themes/${themeName}/variables.less`, (err, data) => {
            res.send(data);

        })
    })
});

app.post('/theme-preview/apply-theme/', (req, res) => {
    req.on('data', data => {


        let [themeName, newRules] = [JSON.parse(data.toString()).themeName , JSON.parse(data.toString()).rules];

        fs.readFile(`${process.cwd()}/themes/${themeName}/variables.less`, (err, data) => {
            let stringData = data.toString();

            newRules.forEach(rule => {
                let reg = new RegExp(`(\@${rule.title}):\s+\w+\;*`);
                stringData = stringData.replace(reg, `@${rule.title}:      ${rule.value};`);
                fs.writeFile()
            })

        });

        //(\@data-grid-cell-height):\s+\w+\;*
    })
})