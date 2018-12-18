var http = require('http');

//引入数据库包
var db = require("./db.js");

var xlsx = require("node-xlsx");

var fs = require("fs")


exports.findAll = function (req, res) {
    var page = req.params.page;
    var pageSize = req.params.pageSize;
    // var sql = 'SELECT * from home_list limit '+page+','+pageSize;
    var sql = 'SELECT * from home_list';
    console.log(sql);
    db.query(sql, function (err, rows) {
        // if (rows) {
        //     var obj = {
        //         status: 200,
        //         conetent: rows
        //     }
        // }
        res.jsonp(rows);
    })
}

// 用户登陆
exports.doLogin = function (req, res) {
    // console.log(req);
    var userName = req.params.userName;
    var passWord = req.params.passWord;
    var sql = 'select * from users where userName ="' + userName + '" and passWord ="' + passWord + '"';
    db.query(sql, function (err, rows) {
        if (rows) {
            var obj = {
                status: 200,
                conetent: rows
            }
        }

        res.jsonp(obj);
    })
}
// 用户注册
exports.doRegister = function (req, res) {
    var userName = req.params.userName;
    var passWord = req.params.passWord;
    var role = req.params.role;
    var nickname = req.params.nickname;
    var sql = "insert into users(userName,passWord,role) values ('" + userName + "','" + passWord + "','" + role + "')";
    console.log(sql);
    db.query(sql, function (err, rows) {
        console.log(rows);
        if (rows) {
            var obj = {
                status: 200,
                conetent: rows
            }
        }
        res.jsonp(obj);
    })
}

//通过用户名去查数据库 注册的时候调用此接口，若该用户已存在，就不让注册

exports.findUserByUserName = function (req, res) {
    var userName = req.params.userName;
    var sql = 'SELECT * from users where userName =' + "'" + userName + "'";
    console.log(sql);
    db.query(sql, function (err, rows) {
        console.log(rows);
        if (rows) {
            var obj = {
                status: 200,
                conetent: rows
            }
        }

        res.jsonp(obj);
    })
}
// 
var https = require('https');
var qs = require('querystring');
// 发送短信验证码
exports.send_message = function (req, res) {
    var msg;
    var apikey = 'de9b38714ef6e11cf8bab7cc827b5576';
    // 修改为您要发送的手机号码，多个号码用逗号隔开
    var mobile = req.params.phone;
    // 修改为您要发送的短信内容
    // var text = '您的验证码是1234';
    // 指定发送的模板编号
    var tpl_id = 2514792;
    var num = "";
    for (var i = 0; i < 4; i++) {
        num += Math.floor(Math.random() * 10)
    }
    // 指定发送模板的内容
    var tpl_value = {
        '#name#': '用户',
        '#code#': num,
        '#hour#': '5分钟'
    };
    // 语音短信的内容
    var code = '1234';
    // 查询账户信息https地址
    var get_user_info_uri = '/v2/user/get.json';
    // 智能匹配模板发送https地址
    var sms_host = 'sms.yunpian.com';
    var voice_host = 'voice.yunpian.com';

    send_sms_uri = '/v2/sms/single_send.json';
    // 指定模板发送接口https地址
    send_tpl_sms_uri = '/v2/sms/tpl_single_send.json';
    // 发送语音验证码接口https地址
    send_voice_uri = '/v2/voice/send.json';





    query_user_info(get_user_info_uri, apikey);

    // send_sms(send_sms_uri, apikey, mobile, text); //调用非模板发送短信方式

    send_tpl_sms(send_tpl_sms_uri, apikey, mobile, tpl_id, tpl_value);

    // send_voice_sms(send_voice_uri, apikey, mobile, code); //调用发送语音短信方式

    function query_user_info(uri, apikey) {
        var post_data = {
            'apikey': apikey,
        }; //这是需要提交的数据
        var content = qs.stringify(post_data);
        post(uri, content, sms_host);
    }

    // function send_sms(uri, apikey, mobile, text) {
    //     var post_data = {
    //         'apikey': apikey,
    //         'mobile': mobile,
    //         'text': text,
    //     }; //这是需要提交的数据  
    //     var content = qs.stringify(post_data);
    //     post(uri, content, sms_host);
    // }

    function send_tpl_sms(uri, apikey, mobile, tpl_id, tpl_value) {
        var post_data = {
            'apikey': apikey,
            'mobile': mobile,
            'tpl_id': tpl_id,
            'tpl_value': qs.stringify(tpl_value),
        }; //这是需要提交的数据  
        var content = qs.stringify(post_data);
        // post(uri, content, sms_host);
        var options = {
            hostname: sms_host,
            port: 443,
            path: uri,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        };
        var req = https.request(options, function (r) {
            r.setEncoding('utf8');
            r.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
                var obj = JSON.parse(chunk);
                var conetent = {
                    opt: obj,
                    yzm: tpl_value
                }
                res.jsonp(conetent);
            });
        });
        req.write(content);
        req.end();
    }

    // function send_voice_sms(uri, apikey, mobile, code) {
    //     var post_data = {
    //         'apikey': apikey,
    //         'mobile': mobile,
    //         'code': code,
    //     }; //这是需要提交的数据  
    //     var content = qs.stringify(post_data);
    //     post(uri, content, voice_host);
    // }

    function post(uri, content, host) {
        var options = {
            hostname: host,
            port: 443,
            path: uri,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        };
        var req = https.request(options, function (r) {
            r.setEncoding('utf8');
            r.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
            });
        });
        req.write(content);
        req.end();
    }
}
// 绑定手机号
exports.bindPhone = function (req, res) {
    var userName = req.params.userName;
    var phone = req.params.phone;
    var sql = 'update users set phone=' + "'" + phone + "'" + 'where userName =' + "'" + userName + "'";
    console.log(sql);
    db.query(sql, function (err, rows) {
        console.log(rows);
        if (rows) {
            var obj = {
                status: 200,
                conetent: rows
            }
        }
        res.jsonp(obj);
    })
}

// 模糊查询职位
exports.vagueQuery = function (req, res) {
    var param1 = req.params.param1;
    var param2 = req.params.param2;
    console.log(param1);
    console.log(param2);
    var sql = '';
    if (param1 == '公司名称') {
        sql = 'select * from home_list where companyName like "%' + param2 + '%"';
    } else if (param1 == '职位名称') {
        sql = 'select * from home_list where zwmc like "%' + param2 + '%"';
    }
    console.log(sql);
    db.query(sql, function (err, rows) {
        console.log(rows);
        if (rows) {
            var obj = {
                status: 200,
                conetent: rows
            }
        }
        res.jsonp(obj);
    })

}

// 职位详情查询
exports.findInfoById = function (req, res) {
    var z_id = req.params.id;
    var sql = 'select * from zwxq where id =' + z_id;
    db.query(sql, function (err, rows) {
        if (rows) {
            var obj = {
                status: 200,
                conetent: rows
            }
        }
        res.jsonp(obj);
    })
}

// findCompanyInfoById
exports.findCompanyInfoById = function (req, res) {
    var company_id = req.params.company_id;
    var sql = 'select * from company_info where z_id =' + company_id;
    console.log(sql);
    db.query(sql, function (err, rows) {
        console.log(rows);
        if (rows) {
            var obj = {
                status: 200,
                conetent: rows
            }
        }
        res.jsonp(obj);
    })
}

// 发布职位
exports.doPostJob = function (req, res) {;
    var companyName = req.body.companyName;
    var companyName = req.params.companyName;
    var addr = req.params.addr;
    var money = req.params.money;
    var zwmc = req.params.zwmc;
    var company_id = req.params.companyId;

    var sql = "insert into home_list(companyName,addr,money,zwmc,company_id) values ('" + companyName + "','" + addr + "','" + money + "','" + zwmc + "','" + company_id + "')";
    // console.log(sql);
    db.query(sql, function (err, rows) {
        if (rows) {
            var obj = {
                status: 200,
                conetent: rows
            }
        }
        res.jsonp(obj);
    })
}

function sliceArray(array, size) {
    var result = [];
    for (var x = 0; x < Math.ceil(array.length / size); x++) {
        var start = x * size;
        var end = start + size;
        result.push(array.slice(start, end));
    }
    return result;
}

// 导出数据生成文档
function writeXls(datas) {
    var buffer = xlsx.build([{
        "name": "export_table",
        "data": datas
    }]);
    fs.writeFileSync("export_table.csv", buffer, {
        'flag': 'w'
    });
}

exports.exportXls = function (req, res) {
    var company_id = req.params.company_id;
    var sql = 'select * from home_list where company_id =' + company_id;
    db.query(sql, function (err, rows) {
        console.log(rows);
        var xlsDatas = [];
        xlsDatas[0] = ['序号', '公司名称', '职位名称', '工作地点', '工资待遇', '公司id'];

        var dataArr = [];
        for (var i = 0; i < rows.length; i++) {
            // 遍历出 i+1 个对象 rows[i]
            for (var j in rows[i]) {
                dataArr.push(rows[i][j]);
            }
        }
        console.log(dataArr);
        var newArr = sliceArray(dataArr, 6);
        for (var k = 0; k < newArr.length; k++) {
            xlsDatas.push(newArr[k]);
        }
        console.log(xlsDatas);
        writeXls(xlsDatas);
        if (rows) {
            var obj = {
                status: 200,
                conetent: rows
            }
        }
        res.jsonp(obj);
    })
}

// 根据company_id 查询该用户发布的所有职位
exports.getAllJob = function (req, res) {
    var company_id = req.params.company_id;
    var sql = 'select * from home_list where company_id =' + company_id;
    db.query(sql, function (err, rows) {
        console.log(rows);
        if (rows) {
            var obj = {
                status: 200,
                conetent: rows
            }
        }
        res.jsonp(obj);
    })
}

// getResumeById
exports.getResumeById = function (req, res) {
    var resume_id = req.params.resume_id;
    var sql = 'select * from resume where resume_id =' + resume_id;
    db.query(sql, function (err, rows) {
        console.log(rows);
        if (rows) {
            var obj = {
                status: 200,
                conetent: rows
            }
        }
        res.jsonp(obj);
    })
}

// 投递简历
exports.postResume = function (req, res) {
    var resume_id = req.params.resume_id;
    var company_id = req.params.company_id;
    var date = req.params.date;
    console.log(resume_id + '--' + company_id);
    var sql = "insert into get_resume_list(resume_id,company_id,date) values ('" + resume_id + "','" + company_id + "','" + date + "')";
    db.query(sql, function (err, rows) {
        console.log(rows);
        if (rows) {
            var obj = {
                status: 200,
                conetent: rows
            }
        }
        res.jsonp(obj);
    })
}

// 查询公司收到的简历
exports.getResumeList = function (req, res) {
    var company_id = req.params.company_id;
    var sql = 'select * from get_resume_list where company_id =' + company_id;
    db.query(sql, function (err, rows) {
        console.log(rows);
        if (rows) {
            var obj = {
                status: 200,
                conetent: rows
            }
        }
        res.jsonp(obj);
    })
}

// 公司检索简历
exports.getResumeByParam = function (req, res) {
    var param = req.params.param;
    console.log(param);
    var sql = 'select * from resume where resume_name like "%' + param + '%"';
    db.query(sql, function (err, rows) {
        console.log(rows);
        if (rows) {
            var obj = {
                status: 200,
                conetent: rows
            }
        }
        res.jsonp(obj);
    })
}

// exports.test = function (req, res) {
//     console.log('进啦');
    
// }
exports.uploadPic = function (req, res) {
    var pic_src = req.params.pic_src;
    var id = req.params.user_id;

    var sql = 'update users set pic_src=' + "'" + pic_src + "'" + 'where id =' + "'" + id + "'";
    // console.log(sql);
    db.query(sql, function (err, rows) {
        // console.log(rows);
        if (rows) {
            var obj = {
                status: 200,
                conetent: rows
            }
        }
        res.jsonp(obj);
    })
}

exports.getPicInfo = function (req, res) {
    var id = req.params.user_id;
    var sql = 'select * from users where id =' + id;
    db.query(sql, function (err, rows) {
        console.log(rows);
        if (rows) {
            var obj = {
                status: 200,
                conetent: rows
            }
        }
        res.jsonp(obj);
    })
}