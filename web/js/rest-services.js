'use strict';

angular.module('myApp.restServices', ['ngResource'])
    .factory('Employee', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/home', {});
        }
    ])
    .factory('zw_detail', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/zw_detail/:id/detail', {});
        }
    ])
    .factory('CompanyInfo', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/company_info/:company_id/company', {});
        }
    ])
    .factory('AddEmployee', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/addEmployee/:firstName/:lastName/:managerId/:title/:department/:officePhone/:cellPhone/:email/:city/:picture/:twitterId/:pic/:blog/:managerName/:reports/add', {});
        }
    ])
    .factory('Login', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/loginEmployee/:userName/:passWord/login', {});
        }
    ])
    .factory('Register', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/registerEmployee/:userName/:passWord/:role/register', {});
        }
    ])
    .factory('User', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/users/:userName/userInfo', {});
        }
    ])
    .factory('Send', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/sendMsg/:phone/msg', {});
        }
    ])
    .factory('Bind', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/bindPhone/:userName/:phone/bind', {});
        }
    ])
    .factory('VagueQuery', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/vague/:param1/:param2/vagueQuery', {});
        }
    ])

    .factory('DoPostJob', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/fabuzw/:companyName/:zwmc/:addr/:money/:companyId/postJob', {});
        }
    ])
    // .factory('DoPostJob', ['$resource',
    //     function ($resource) {
    //         return $resource('http://localhost:3000/fabuzw/postJob', {}, {
    //             'post': {
    //                 method: 'POST'
    //             }
    //         });
    //     }
    // ])
    .factory('JobListByUser', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/getAllJob/:company_id/jobs', {});
        }
    ])
    .factory('GetResume', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/getResumeByUserId/:resume_id/getResumeInfo', {});
        }
    ])
    .factory('PostResume', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/postResume/:resume_id/:company_id/:date/postResumeInfo', {});
        }
    ])
    .factory('GetResumeListByUser', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/getResume/:company_id/getResumeList', {});
        }
    ])
    .factory('QueryResmue', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/queryResumeByParam/:param/queryResume', {});
        }
    ])
    .factory('ExportData', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/export/:company_id/export_xls', {});
        }
    ])

    .factory('UploadPic', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/uploads/:user_id/:pic_src/updloadPic', {});
        }
    ])
    .factory('GetPic', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/getPic/:user_id/getPicInfo', {});
        }
    ])
    .factory('Test', ['$resource',
        function ($resource) {
            return $resource('http://localhost:3000/test/socketio', {}, {
                'post': {
                    method: 'POST'
                }
            });
        }
    ]);