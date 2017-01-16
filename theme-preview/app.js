const express = require('express'),
    path = require('path'),
    fs = require('fs'),
    spawn = require('child_process').spawn,
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

            for (let i in newRules) {
                console.log(newRules)
                let reg = new RegExp(`@${i}:\\s+\\S+`);
                stringData = stringData.replace(reg, `@${i}:      ${newRules[i]};`);
               
            };
            fs.writeFile(`${process.cwd()}/themes/${themeName}/variables.less`, stringData, function(err) {
                if (err) {
                    console.error(err);
                }
                const grunt = spawn('grunt',['css']);
                    
                grunt.stdout.pipe(process.stdout);

                 grunt.stderr.pipe(process.stderr);

                 grunt.on('close', (code) => {
                   console.log(`child process exited with code ${code}`);
                    res.send('фсё')
                });
               
            })

        });

        //(\@data-grid-cell-height):\s+\w+\;* 

        //@white-color:\s+\S+
    })
})