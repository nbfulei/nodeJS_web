var express = require('express'),
    path = require('path'),
    employees = require('./routes/routers');
bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(express.static(path.join(__dirname, '../web')));

app.get('/home', employees.findAll);
app.get('/zw_detail/:id/detail', employees.findInfoById); // 根据职位ID查询职位详情信息
app.get('/company_info/:company_id/company', employees.findCompanyInfoById);
app.get('/loginEmployee/:userName/:passWord/login', employees.doLogin);
app.get('/registerEmployee/:userName/:passWord/:role/register', employees.doRegister);
app.get('/users/:userName/userInfo', employees.findUserByUserName);
app.get('/sendMsg/:phone/msg', employees.send_message);
app.get('/bindPhone/:userName/:phone/bind', employees.bindPhone);
app.get('/vague/:param1/:param2/vagueQuery', employees.vagueQuery);
app.get('/fabuzw/:companyName/:zwmc/:addr/:money/:companyId/postJob', employees.doPostJob); //发布职位
app.get('/getAllJob/:company_id/jobs', employees.getAllJob); // 根据company_id 查询该用户发布的所有职位
app.get('/getResumeByUserId/:resume_id/getResumeInfo', employees.getResumeById);
app.get('/postResume/:resume_id/:company_id/:date/postResumeInfo', employees.postResume);
app.get('/getResume/:company_id/getResumeList', employees.getResumeList);
app.get('/queryResumeByParam/:param/queryResume', employees.getResumeByParam);
app.get('/export/:company_id/export_xls', employees.exportXls);
app.get('/uploads/:user_id/:pic_src/updloadPic', employees.uploadPic); // 头像上传
app.get('/getPic/:user_id/getPicInfo', employees.getPicInfo);

app.post('/test/socketio', function (req, res) {
    res.sendFile(__dirname + '../web'); 
});

var server = require('http').Server(app);

server.listen(3000, '127.0.0.1');

var io = require('socket.io')(server);
io.sockets.on('connection', function (socket) {
    console.log('连接成功！');
    console.log(socket.id);
    socket.on('message', function (data) {
        console.log(data);
        socket.emit('c_hi','消息收到了')
    });
    // socket.on('login', function(data) {
    //     console.log(data);
    // })
});
console.log('Listening on port 3000...');