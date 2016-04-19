var express = require('express');
app = express();
app.use(express.bodyParser());
app.use(express['static'](__dirname));
app.listen(process.env.PORT || 666);
app.get('/cdn/*', function(req, res) {
   //console.log(req.url);
   res.redirect('http://test-cloud.sbis.ru/' + req.url);
});