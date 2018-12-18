'use strict';

var app = angular.module('myApp.controllers', []);

// app.run(function($ionicPlatform) {
//     $ionicPlatform.ready(function() {
//       // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//       // for form inputs)
//       if(window.cordova && window.cordova.plugins.Keyboard) {
//         cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//       }
//       if(window.StatusBar) {
//         StatusBar.styleDefault();
//       }
//     });
//   })

app.controller('MainCtrl', ['$scope', '$rootScope', '$window', '$location', function ($scope, $rootScope, $window, $location) {
    $scope.slide = '';
    $rootScope.back = function () {
        $scope.slide = 'slide-right';
        $window.history.back();
    }
    $rootScope.go = function (path) {
        $scope.slide = 'slide-left';
        console.log(path);
        $location.url(path);
    }

    $rootScope.addEmployee = function (path) {
        $scope.slide = 'slide-left';
        $location.url(path);
    }

}])
app.controller('HomeCtrl', ['$scope', '$location', 'Employee', function ($scope, $location, Employee) {
    var userInfo = sessionStorage.getItem('user');
    $scope.bools = true;
    console.log(userInfo);
    // if (userInfo !== null) {
    //     $location.url('/home');
    //     $scope.username = JSON.parse(userInfo).userName;
    // } else {
    //     $location.url('/login');
    // }
    if (userInfo == null) {
        $scope.isLogin = true;
    } else {
        $scope.username = JSON.parse(userInfo).userName;
        $scope.isLogin = false;
    }
    // var params = {
    //     page: 1,
    //     pageSize: 5
    // }

    // Employee.get(params, function (res) {
    //     if (res.status === 200) {
    //         $scope.employees = res.conetent;
    //     }
    // }); // 查询列表
    $scope.employees = Employee.query();
    


    $scope.goDetail = function (id, company_id) {
        $location.url('/detail');
        sessionStorage.setItem('z_id', id);
        sessionStorage.setItem('company_id', company_id);
    }

    $scope.goSearch = function () {
        console.log('1212');
        $location.url('/search');
    }
    $scope.goPersonal = function () {
        $location.url('/personal');
    }
    $scope.goHome = function () {
        $location.url('/home');
    }
    $scope.loginOut = function () {
        sessionStorage.clear();
        $scope.isLogin = true;
        $location.url('/home');
    }

    $scope.bindPhone = function (path) {
        $location.url(path);
    }



}])

app.controller('LoginCtrl', ['$scope', '$routeParams', 'Login', '$location', function ($scope, $routeParams, Login, $location) {
    var role = ''; // 用户类型
    $scope.updateType = function (item) {
        role = item;
    }

    function login(params) {
        Login.get(params, function (res) {
            if (res.status === 200) {
                var userType = res.conetent[0].role;
                if (role === userType) {
                    Login.get(params, function (res) {
                        if (res.status === 200) {
                            console.log(res.conetent);
                            if (res.conetent.length > 0) {
                                if (res.conetent[0].role === 'personal') {
                                    $location.url('/home');
                                } else if (res.conetent[0].role === 'company') {
                                    $location.url('/home2')
                                }

                                var obj = {
                                    userName: res.conetent[0].userName,
                                    passWord: res.conetent[0].passWord,
                                    phone: res.conetent[0].phone,
                                    role: res.conetent[0].role,
                                    company_id: res.conetent[0].company_id,
                                    resume_id: res.conetent[0].resume_id,
                                    user_id: res.conetent[0].id
                                }
                                console.log(obj);
                                // var socket = io.connect('http://127.0.0.1:3000');
                                // socket.emit('login', {
                                //     text: "我进来了！"
                                // });
                                sessionStorage.setItem('user', JSON.stringify(obj)); //登陆成功之后将用户信息存到sessionStorage里面
                            }
                        }
                    })
                } else {
                    alert('该用户不是所选择的用户类型，请重新选择！');
                }
            }
        })
    }
    $scope.doLogin = function () {

        var params = {
            userName: $scope.username,
            passWord: $scope.password
        }
        if (role === 'personal') {
            login(params);
        }
        if (role === 'company') {
            login(params);
        }
        if (role === '') {
            alert('请选择登陆用户');
        }
    }

    $scope.userRegister = function (path) {
        $location.url(path);
    }
}])

app.controller('registerCtrl', ['$scope', '$routeParams', 'Register', '$location', 'User', function ($scope, $routeParams, Register, $location, User) {
    $scope.doRegister = function () {
        if ($scope.password === $scope.repassword) {
            var params = {
                userName: $scope.username,
                passWord: $scope.password,
                role: $scope.role
            }
            User.get({
                userName: $scope.username
            }, function (res) {
                if (res.status === 200 && res.conetent.length > 0) {
                    alert('该用户已存在！');
                } else {
                    Register.get(params, function (res) {
                        if (res.status === 200) {
                            var msg = "恭喜您注册成功，现在去登陆？";
                            if (confirm(msg) == true) {
                                $location.url('/login');
                            }
                        }
                    })
                }
            })

        } else {
            alert('两次密码不一致，请重新输入！');
        }

    }
}])
app.controller('BindPhoneCtrl', ['$scope', '$routeParams', '$location', 'Send', 'Bind', function ($scope, $routeParams, $location, Send, Bind) {

    var userInfo = sessionStorage.getItem('user');

    console.log(userInfo);
    if (userInfo !== null) {
        $location.url('/bindPhone');
    } else {
        $location.url('/login');
    }

    var yzm = ''; // 存放接收到的验证码
    $scope.bool = false;
    var role = JSON.parse(userInfo).role;

    $scope.black = function (path) {
        console.log(role);
        if (role === 'personal') {
            $location.url(path);
        } else if (role === 'company') {
            $location.url('/home2')
        }

    }

    // 60秒倒计时
    function settime(val, countdown) {
        if (countdown == 0) {
            val.removeAttribute("disabled");
            val.innerHTML = "点击获取";
            countdown = 60;
        } else {
            val.setAttribute("disabled", true);
            val.innerHTML = countdown + 's';
            countdown--;
            setTimeout(function () {
                settime(val, countdown);
            }, 1000)
        }

    }

    $scope.getYzm = function () {
        console.log($scope.phone);
        if ($scope.phone !== undefined) {
            var dom = $('#hqyzm')[0];
            var params = {
                phone: $scope.phone
            }
            Send.get(params, function (res) {
                if (res.opt.msg === '发送成功') {
                    yzm = res.yzm['#code#'];
                    settime(dom, 60);
                    console.log(yzm);
                } else {
                    alert(res.opt.msg);
                }
            })
        } else {
            alert('手机不能为空!');
        }

    }

    $scope.doBindPhone = function () {
        if ($scope.yzm !== '') {
            if (yzm === $scope.yzm) {
                $scope.bool = false;
                // 首先获取当前用户  从sessionStorage
                var user = JSON.parse(sessionStorage.getItem('user'));
                var params = {
                    userName: user.userName,
                    phone: $scope.phone
                }
                Bind.get(params, function (res) {
                    if (res.status === 200) {
                        alert('手机号绑定成功');
                        $location.url('/home');
                    }
                })
            } else {
                $scope.bool = true;
            }
        } else {
            $scope.bool = false;
            alert('请输入验证码!');
        }
    }
}])

app.controller('Retrieve_passwordCtrl', ['$scope', '$routeParams', '$location', function ($scope, $routeParams, $location) {
    console.log($scope);
}])

app.controller('DetailCtrl', ['$scope', '$routeParams', '$location', 'zw_detail', 'CompanyInfo', 'PostResume', function ($scope, $routeParams, $location, zw_detail, CompanyInfo, PostResume) {
    $scope.back = function () {
        $location.url('/home');
    }
    var z_id = sessionStorage.getItem('z_id');
    var company_id = sessionStorage.getItem('company_id');
    var param = {
        id: z_id
    }
    zw_detail.get(param, function (res) {
        if (res.status === 200) {
            $scope.zw_conetent = res.conetent[0];
        }
    });
    var param2 = {
        company_id: company_id
    }
    CompanyInfo.get(param2, function (res) {
        if (res.status === 200) {
            $scope.company_conetent = res.conetent[0];
            console.log($scope.company_conetent);
        }
    });
    // 跳转到公司详情页面
    $scope.goCompanyDetail = function (id) {
        $location.url('/companyDetail');
    }

    $scope.is_sc = true;
    // 日期格式化
    function formatDate(time, format = 'YY-MM-DD hh:mm:ss') {
        var date = new Date(time);

        var year = date.getFullYear(),
            month = date.getMonth() + 1, //月份是从0开始的
            day = date.getDate(),
            hour = date.getHours(),
            min = date.getMinutes(),
            sec = date.getSeconds();
        var preArr = Array.apply(null, Array(10)).map(function (elem, index) {
            return '0' + index;
        }); ////开个长度为10的数组 格式为 00 01 02 03

        var newTime = format.replace(/YY/g, year)
            .replace(/MM/g, preArr[month] || month)
            .replace(/DD/g, preArr[day] || day)
            .replace(/hh/g, preArr[hour] || hour)
            .replace(/mm/g, preArr[min] || min)
            .replace(/ss/g, preArr[sec] || sec);

        return newTime;
    }

    // 投递简历
    $scope.todiJl = function () {
        var user = sessionStorage.getItem('user');
        if (user !== null) { // 判断是否已登录
            var userObj = JSON.parse(user);
            var date = new Date();
            var time = formatDate(date.getTime());
            var params = {
                resume_id: userObj.resume_id,
                company_id: $scope.company_conetent.z_id,
                date: time
            }
            PostResume.get(params, function (res) {
                if (res.status === 200) {
                    alert('恭喜您，简历投递成功！')
                }
            })

        } else {
            alert('请先登陆，再投递简历！');
            $location.url('/login');
        }
    }

    // 跳转到聊天界面
    $scope.chat = function (item) {
        console.log(item);
        sessionStorage.setItem('companyInfo', JSON.stringify(item));
        $location.url('/chat');
    }



}])
app.controller('CompanyDetailCtrl', ['$scope', '$routeParams', '$location', function ($scope, $routeParams, $location) {
    console.log($scope);
    $scope.back = function () {
        $location.url('/home');
    }
}])
app.controller('SearchCtrl', ['$scope', '$routeParams', '$location', 'VagueQuery', function ($scope, $routeParams, $location, VagueQuery) {
    console.log($scope);
    $scope.zw_list = [];
    $scope.bools = true;

    $scope.back = function () {
        $location.url('/home');
    }

    $scope.goHome = function () {
        $location.url('/home');
    }
    $scope.goSearch = function () {
        console.log('1212');
        $location.url('/search');
    }
    $scope.goPersonal = function () {
        $location.url('/personal');
    }
    // 模糊查询
    $scope.doQuery = function () {
        var params = {
            param1: $scope.queryType,
            param2: $scope.param
        }
        VagueQuery.get(params, function (res) {
            if (res.status === 200) {
                $scope.zw_list = res.conetent;
            }
        })
    }

}])

app.controller('PersonalCtrl', ['$scope', '$routeParams', '$location', 'GetResume', function ($scope, $routeParams, $location, GetResume) {
    console.log($scope);
    $scope.bools = true;

    var user = sessionStorage.getItem('user');
    if (user === null) {
        alert('请先登陆！')
        $location.url('/login');
    }
    $scope.back = function () {
        $location.url('/home');
    }

    $scope.goSearch = function () {
        console.log('1212');
        $location.url('/search');
    }
    $scope.goPersonal = function () {
        $location.url('/personal');
    }
    $scope.goHome = function () {
        $location.url('/home');
    }

    var userInfo = sessionStorage.getItem('user');
    var userObj = JSON.parse(userInfo);
    console.log(userObj);
    var params = {
        resume_id: userObj.resume_id
    }
    GetResume.get(params, function (res) {
        if (res.status === 200) {
            $scope.personal_info = res.conetent[0];
        }
    })
}])

app.controller('Home2Ctrl', ['$scope', '$routeParams', '$location', 'QueryResmue', function ($scope, $routeParams, $location, QueryResmue) {
    console.log($scope);
    $scope.bools = true;
    $scope.back = function () {
        $location.url('/home2');
    }
    $scope.goMine = function () {
        $location.url('/company_center');
    }
    $scope.postJob = function () {
        $location.url('/job_posting');
    }
    $scope.jlSearch = function () {
        $location.url('/home2');
    }

    var userInfo = sessionStorage.getItem('user');
    console.log(userInfo);

    if (userInfo == null) {
        $scope.isLogin = true;
    } else {
        $scope.username = JSON.parse(userInfo).userName;
        $scope.isLogin = false;
    }

    $scope.loginOut = function () {
        sessionStorage.clear();
        $scope.isLogin = true;
        $location.url('/home2');
    }

    $scope.bindPhone = function (path) {
        $location.url(path);
    }

    $scope.resumes = [];
    // 检索简历
    $scope.doQuery = function () {
        var params = {
            param: $scope.param
        }
        QueryResmue.get(params, function (res) {
            if (res.status === 200) {
                $scope.resumes = res.conetent;
            }
        })
    }
    $scope.goResumeDetail = function (id) {
        sessionStorage.setItem('resume_id', id);
        $location.url('/resumeDetail');
    }
}])

app.controller('JobCtrl', ['$scope', '$routeParams', '$location', 'CompanyInfo', 'DoPostJob', function ($scope, $routeParams, $location, CompanyInfo, DoPostJob) {
    console.log($scope);


    $scope.bools = true;
    $scope.back = function () {
        $location.url('/home2');
    }
    $scope.goMine = function () {
        $location.url('/company_center');
    }
    $scope.postJob = function () {
        $location.url('/job_posting');
    }
    $scope.jlSearch = function () {
        $location.url('/home2');
    }

    var user = sessionStorage.getItem('user');
    var userObj = JSON.parse(user);
    console.log(userObj);

    var companyName = '';
    // 根据conmpany_id 查询出公司名称
    var p = {
        company_id: userObj.company_id
    }
    CompanyInfo.get(p, function (res) {
        if (res.status === 200) {
            $scope.companyName = res.conetent[0].name;
            $scope.companyId = res.conetent[0].z_id;
            console.log($scope.companyName);
        }
    })
    // 发布职位
    $scope.fbZw = function () {

        var params = {
            zwmc: $scope.gzzw,
            money: $scope.gzdy,
            addr: $scope.gzdd,
            companyName: $scope.companyName,
            companyId: $scope.companyId
        }

        DoPostJob.get(params, function (res) {
            if (res.status === 200) {
                alert('职务发布成功！');
                $scope.gzzw = '';
                $scope.gzdy = '';
                $scope.gzdd = '';
            }
        })
    }

}])

app.controller('CompanyCenterCtrl', ['$scope', '$routeParams', '$location', 'JobListByUser', 'GetResumeListByUser', 'GetResume', 'ExportData', 'UploadPic', 'GetPic', function ($scope, $routeParams, $location, JobListByUser, GetResumeListByUser, GetResume, ExportData, UploadPic, GetPic) {
    console.log($scope);
    $scope.pageSize = 3;
    $scope.page = 1;
    $scope.bools = true;
    $scope.back = function () {
        $location.url('/home2');
    }
    $scope.goMine = function () {
        $location.url('/company_center');
    }
    $scope.postJob = function () {
        $location.url('/job_posting');
    }
    $scope.jlSearch = function () {
        $location.url('/home2');
    }

    var user = sessionStorage.getItem('user');
    var userObj = JSON.parse(user);
    $scope.username = userObj.userName;

    // 查看简历详情信息
    $scope.toDetail = function (id) {
        console.log(id);
        $location.url('/resumeDetail')
        sessionStorage.setItem('resume_id', id);
    }
    $scope.goFbdzw = function () {
        $location.url('/job');
    }
    $scope.goGetresume = function () {
        $location.url('/get_resume');
    }

    document.getElementById('img').addEventListener('change', function () {

        var reader = new FileReader();
        reader.readAsDataURL(this.files[0]);
        console.log(this.files[0]);
        var fileSize = Math.round(this.files[0].size / 1024 / 1024); //以M为单位
        reader.onload = function (e) {
            compress(reader.result, fileSize);
        };

        //this.files[0] 该信息包含：图片的大小，以byte计算 获取size的方法如下：this.files[0].size;
    }, false);

    function compress(res, fileSize) { //res代表上传的图片，fileSize大小图片的大小
        var img = new Image(),
            maxW = 120; //设置最大宽度

        img.onload = function () {
            var cvs = document.createElement('canvas'),
                ctx = cvs.getContext('2d');
            cvs.style.position = 'relative';
            cvs.style.top = '-240px';
            cvs.style.width = '120px';
            cvs.style.height = '120px';
            cvs.style.borderRadius = '100%';
            if (img.width > maxW) {
                img.height *= maxW / img.width;
                img.width = maxW;
            }

            cvs.width = img.width;
            cvs.height = img.height;

            ctx.clearRect(0, 0, cvs.width, cvs.height);
            ctx.drawImage(img, 0, 0, img.width, img.height);

            var compressRate = getCompressRate(1, fileSize);

            var dataUrl = cvs.toDataURL('image/jpeg', compressRate);
            console.log($('#pic_id'));
            $('#pic_id')[0].appendChild(cvs);
            console.log(dataUrl);
            var params = {
                pic_src: dataUrl,
                user_id: userObj.user_id
            }
            console.log(params);
            UploadPic.get(params, function (res) {
                console.log(res);
            })
        }

        img.src = res;
    }

    function getCompressRate(allowMaxSize, fileSize) { //计算压缩比率，size单位为MB
        var compressRate = 1;

        if (fileSize / allowMaxSize > 4) {
            compressRate = 0.5;
        } else if (fileSize / allowMaxSize > 3) {
            compressRate = 0.6;
        } else if (fileSize / allowMaxSize > 2) {
            compressRate = 0.7;
        } else if (fileSize > allowMaxSize) {
            compressRate = 0.8;
        } else {
            compressRate = 0.9;
        }

        return compressRate;
    }

    // 如果已经上传过头像就直接从数据库获取
    var params = {
        user_id: userObj.user_id
    }
    $('#pic_id')[0].style.opacity = 1;
    GetPic.get(params, function (res) {
        if (res.status === 200 && res.conetent[0].pic_src !== null) {
            console.log(res);
            $scope.img_src = res.conetent[0].pic_src;
            var imgdom = document.createElement('img');
            imgdom.style.position = 'relative';
            imgdom.style.top = '-241px';
            imgdom.style.width = '120px';
            imgdom.style.height = '120px';
            imgdom.style.borderRadius = '100%';
            imgdom.src = $scope.img_src;
            imgdom.style.opacity = 1;
            $('#pic_id')[0].appendChild(imgdom);
        }
    })

}])

app.controller('Edit_resumeCtrl', ['$scope', '$routeParams', '$location', function ($scope, $routeParams, $location) {
    var params = {
        a: '111'
    }
    $scope.test = function () {
        var socket = io.connect('http://127.0.0.1:3000');
        console.log(params);
        socket.emit('message', {
            text: params
        });

        Test.post(params, function (res) {

        })
    }
}])


app.controller('Job2Ctrl', ['$scope', '$location', 'JobListByUser', 'ExportData', function ($scope, $location, JobListByUser, ExportData) {
    var user = sessionStorage.getItem('user');
    var userObj = JSON.parse(user);
    $scope.username = userObj.userName;
    console.log(userObj);
    var params = {
        company_id: userObj.company_id
    }
    // 查询当前登陆的公司发布的职位
    JobListByUser.get(params, function (res) {
        if (res.status === 200) {
            $scope.job_list = res.conetent;
        }
    });

    // 导出数据
    $scope.loads = function () {
        // 查询当前登陆的公司发布的职位
        ExportData.get(params, function (res) {
            if (res.status === 200) {
                alert('导出数据成功！');
                $scope.job_list = res.conetent;
            }
        });
    }
}])

app.controller('ResumeCtrl', ['$scope', '$routeParams', '$location', 'GetResumeListByUser', function ($scope, $routeParams, $location, GetResumeListByUser) {
    var user = sessionStorage.getItem('user');
    var userObj = JSON.parse(user);
    $scope.username = userObj.userName;
    console.log(userObj);
    var params = {
        company_id: userObj.company_id
    }

    // 查询当前登陆的公司收到的简历
    GetResumeListByUser.get(params, function (res) {
        if (res.status === 200) {
            $scope.resume_list = res.conetent;
        }
    })
}])

app.controller('ChatCtrl', ['$scope', '$routeParams', '$location', function ($scope, $routeParams, $location) {
    var company = sessionStorage.getItem('companyInfo');
    console.log(company);
    $scope.obj = JSON.parse(company);
    $scope.sendMsg = function () {
        var socket = io.connect('http://127.0.0.1:3000');
        socket.emit('message', {
            text: $scope.msg
        });
        socket.on('c_hi', function (data) {
            console.log(data);
        })
    }
}])