var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var app = express();
app.set("view engine", 'pug');

mongoose.connect('mongodb://localhost/webdxd')

var studentSchema = {
    name: String,
    age: Number,
    school: String
};

var studentModel = mongoose.model('Student', studentSchema, 'student')

app.get('/', function (req, res) {
    studentModel.find().exec(function (err, doc) {
        // if (err) {
        //     res.send("network error")
        // } else {
        //     res.send(doc);
        // }
        res.render(path.join(__dirname, 'view/index.pug'), {studentList: doc})
    });

    // res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})