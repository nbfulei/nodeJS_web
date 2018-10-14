'use strict';

angular.module('myApp', [
    'ngTouch',
    'ngRoute',
    'ngAnimate',
    'myApp.controllers',
    'myApp.restServices'
]).
config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'views/login/login.html',
        controller: 'LoginCtrl'
    })
    $routeProvider.when('/search', {
        templateUrl: 'views/search/search.html',
        controller: 'SearchCtrl'
    });
    $routeProvider.when('/home', {
        templateUrl: 'views/home/home.html',
        controller: 'HomeCtrl'
    });
    $routeProvider.when('/home2', {
        templateUrl: 'views/home/home2.html',
        controller: 'Home2Ctrl'
    });
    $routeProvider.when('/job_posting', {
        templateUrl: 'views/company/job-posting.html',
        controller: 'JobCtrl'
    });
    $routeProvider.when('/job', {
        templateUrl: 'views/company/job.html',
        controller: 'Job2Ctrl'
    });
    $routeProvider.when('/get_resume', {
        templateUrl: 'views/company/get-resume.html',
        controller: 'ResumeCtrl'
    });
    $routeProvider.when('/chat', {
        templateUrl: 'views/chat/chat.html',
        controller: 'ChatCtrl'
    });
    $routeProvider.when('/company_center', {
        templateUrl: 'views/company/company-center.html',
        controller: 'CompanyCenterCtrl'
    });
    $routeProvider.when('/personal', {
        templateUrl: 'views/personal/personal.html',
        controller: 'PersonalCtrl'
    });
    $routeProvider.when('/edit_resume', {
        templateUrl: 'views/personal/edit-resume.html',
        controller: 'Edit_resumeCtrl'
    });
    $routeProvider.when('/detail', {
        templateUrl: 'views/detail/detail.html',
        controller: 'DetailCtrl'
    });
    $routeProvider.when('/companyDetail', {
        templateUrl: 'views/detail/company_detail.html',
        controller: 'CompanyDetailCtrl'
    });
    $routeProvider.when('/resumeDetail', {
        templateUrl: 'views/detail/resume-detail.html',
        controller: 'ResumeDetailCtrl'
    });
    $routeProvider.when('/register', {
        templateUrl: 'views/register/register.html',
        controller: 'registerCtrl'
    });
    $routeProvider.when('/bindPhone', {
        templateUrl: 'views/bindPhone/bindPhone.html',
        controller: 'BindPhoneCtrl'
    });
    $routeProvider.when('/retrieve_password', {
        templateUrl: 'views/retrieve-password/retrieve-password.html',
        controller: 'Retrieve_passwordCtrl'
    });
    $routeProvider.otherwise({
        redirectTo: '/home'
    });
}]);

