"use strict";angular.module("bookSearchApp",["ngAnimate","ngStorage","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","firebase","firebase.ref","firebase.auth"]),angular.module("bookSearchApp").controller("searchController",["$location","Ref","searchFormData","bookData","$scope","$firebaseArray","$localStorage",function(a,b,c,d,e,f,g){var h=this;console.log(g.userid),h.searchFeilds=c,h.searchFeild=h.searchFeilds[0],h.finalList=[],h.search=function(b){b&&(d.setQueryString(h.query,h.searchFeild.keyword),a.path("/bookList"))}}]).controller("bookListController",["Ref","bookData","bookResourceFactory","$scope","$firebaseArray","$localStorage",function(a,b,c,d,e,f){var g=this;g.list=e(a.child("mybooks")),c.get({q:b.getQueryString(),maxResults:"25"},function(a){delete g.searchResults.items,console.log(a.items),b.setBookArray(a.items),g.searchResults=b.getBookArray()}),g.order=function(a){g.reverse=g.predicate===a?!g.reverse:!1,g.predicate=a},g.addBook=function(a){console.log("here"),a&&f.userid&&(a.uid=f.userid,console.log(a),g.list.$add(a))},d.$watch(function(){return b.getQueryString()},function(a,d){g.searchResults={},a!==d&&c.get({q:b.getQueryString(),maxResults:"25"},function(a){console.log(a),b.setBookArray(a.items),g.searchResults=b.getBookArray()})})}]).service("bookResourceFactory",["$resource","bookData",function(a,b){return a("https://www.googleapis.com/books/v1/volumes",{callback:"JSON_CALLBACK"},{get:{method:"JSONP"}})}]).service("searchFormData",function(){return[{text:"Title",keyword:"intitle"},{text:"Author",keyword:"inauthor"},{text:"Subject",keyword:"insubject"}]}).service("bookData",function(){var a=[],b="";return{setQueryString:function(a,c){b=c+":"+a.split(" ").join("+")},getQueryString:function(){return b},setBookArray:function(b){a=[];for(var c in b)b.hasOwnProperty(c)&&("ALLOWED"===b[c].accessInfo.textToSpeechPermission||"ALLOWED_FOR_ACCESSIBILITY"===b[c].accessInfo.textToSpeechPermission?b[c].accessInfo.isTTSE=!0:b[c].accessInfo.isTTSE=!1,b[c].volumeInfo.hasOwnProperty("averageRating")||(b[c].volumeInfo.averageRating="Note yet rated"),b[c].volumeInfo.hasOwnProperty("imageLinks")||(b[c].volumeInfo.imageLinks={thumbnail:"https://placeholdit.imgix.net/~text?txtsize=33&txt=Not+Found&w=128&h=166"}),a.push(b[c]))},getBookArray:function(){return a}}}).directive("bookSearchForm",function(){return{restrict:"E",template:searchFormTemp,replace:!0,controller:"searchController",controllerAs:"searchCtr"}}).directive("bookList",function(){return{restrict:"E",template:bookListTemp,replace:!0,controller:"bookListController",controllerAs:"bookListCtr"}}).directive("mybookList",function(){return{scope:{item:"="},restrict:"E",template:MybookList,controller:"searchController"}});var searchFormTemp='<div class="row"><div class="col-md-12"><form name="searchForm" ng-submit="searchCtr.search(searchForm.$valid)" class="form-inline" role="form" novalidate><div class="form-group" ng-class="{ \'has-error\' : searchForm.query.$invalid && !searchForm.query.$pristine }"><label class="sr-only" for="searchfeild">Search:</label><input type="text" class="form-control" name="query" ng-model="searchCtr.query" placeholder="Search..." required><p ng-show="searchForm.query.$invalid && !searchForm.query.$pristine" class="help-block">A search query is required.</p></div><div class="form-group"><label for="searchScope" class="sr-only">Limit Search Scope:</label><select class="form-control" ng-model="searchCtr.searchFeild" ng-options="feild.text for feild in searchCtr.searchFeilds"></select></div><button type="submit" class="btn ng-class:{ \'btn-primary\' : searchForm.query.$valid, \'btn-danger\': searchForm.query.$invalid && !searchForm.query.$pristine}" ng-disabled="userForm.$invalid">Submit</button></form></div></div>',bookListTemp='<section><div class=row><div class="col-md-12"><p class="order-by-group">Sort Results by:</p> <div class="btn-group order-by-group" role="group" aria-label="Order Results By"><button type="button" class="btn" ng-class="(bookListCtr.predicate === \'volumeInfo.title\') ? \'btn-primary\' : \'btn-default\'" ng-click="bookListCtr.order(\'volumeInfo.title\')">Title</button><button type="button" class="btn" ng-class="(bookListCtr.predicate === \'volumeInfo.authors\') ? \'btn-primary\' : \'btn-default\'" ng-click="bookListCtr.order(\'volumeInfo.authors\')">Author</button><button type="button" class="btn" ng-class="(bookListCtr.predicate === \'volumeInfo.averageRating\') ? \'btn-primary\' : \'btn-default\'" ng-click="bookListCtr.order(\'volumeInfo.averageRating\')">Rating</button></div></div></div><div class="row"><div class="col-md-12"><p ng-show="bookListCtr.searchResults.length === 0" class="bg-danger center-block text-center">No Results Returned</p><ul class="media-list" ng-show="bookListCtr.searchResults.length > 0"><li class="media" ng-repeat="book in bookListCtr.searchResults | orderBy:bookListCtr.predicate:BookListCtr.reverse"><div class="media-left"><a ng-href="{{book.volumeInfo.infoLink}}"><img class="media-object" ng-src={{book.volumeInfo.imageLinks.thumbnail}} alt="Book Cover"></a></div><div class="media-body"><h4 class="media-heading">{{book.volumeInfo.title}}</h4><h5>{{book.volumeInfo.authors.join(", ")}}</h5><p ng-show="book.accessInfo.isTTSE" class="text-success center-block">Text-To-Speech is Enabled</p><p ng-show="!book.accessInfo.isTTSE" class="text-danger center-block">Text-To-Speech Not Enabled</p><p>Average Rating: <span class="rating">{{book.volumeInfo.averageRating}}</span></p><button type="submit" ng-click="bookListCtr.addBook(book)">Add to the read list </button><p>{{book.volumeInfo.description}}</p></div></li></ul></div></div></section>';angular.module("firebase.config",[]).constant("FBURL","https://onlinebookportal.firebaseio.com").constant("SIMPLE_LOGIN_PROVIDERS",["password","anonymous"]).constant("loginRedirectPath","/login"),angular.module("firebase.ref",["firebase","firebase.config"]).factory("Ref",["$window","FBURL",function(a,b){return new a.Firebase(b)}]),angular.module("bookSearchApp").controller("ChatCtrl",["$scope","Ref","$firebaseArray","$timeout",function(a,b,c,d){function e(b){a.err=b,d(function(){a.err=null},5e3)}a.messages=c(b.child("messages").limitToLast(10)),a.messages.$loaded()["catch"](e),a.addMessage=function(b){b&&a.messages.$add({text:b})["catch"](e)}}]),angular.module("bookSearchApp").controller("ReadCtrl",["$scope","Ref","$firebaseArray","$timeout",function(a,b,c,d){function e(b){a.err=b,d(function(){a.err=null},5e3)}a.messages=c(b.child("mybooks")),a.messages.$loaded()["catch"](e),a.addMessage=function(b){b&&a.messages.$add({text:b})["catch"](e)}}]),angular.module("bookSearchApp").filter("reverse",function(){return function(a){return angular.isArray(a)?a.slice().reverse():[]}}),function(){angular.module("firebase.auth",["firebase","firebase.ref"]).factory("Auth",["$firebaseAuth","Ref",function(a,b){return a(b)}])}(),angular.module("bookSearchApp").controller("LoginCtrl",["$scope","Auth","$location","$q","Ref","$timeout","$rootScope","$localStorage",function(a,b,c,d,e,f,g,h){function i(a){return j(a.substr(0,a.indexOf("@"))||"")}function j(a){a+="";var b=a.charAt(0).toUpperCase();return b+a.substr(1)}function k(a){console.log(a),h.token=a.token,h.userid=a.uid,c.path("/booklist")}function l(b){a.err=b}a.oauthLogin=function(c){a.err=null,b.$authWithOAuthPopup(c,{rememberMe:!0}).then(k,l)},a.passwordLogin=function(c,d){a.err=null,b.$authWithPassword({email:c,password:d},{rememberMe:!0}).then(k,l)},a.createAccount=function(c,g,h){function j(a){var b=e.child("users",a.uid),g=d.defer();return b.set({email:c,name:i(c)},function(a){f(function(){a?g.reject(a):g.resolve(b)})}),g.promise}a.err=null,g?g!==h?a.err="Passwords do not match":b.$createUser({email:c,password:g}).then(function(){return b.$authWithPassword({email:c,password:g},{rememberMe:!0})}).then(j).then(k,l):a.err="Please enter a password"}}]),angular.module("bookSearchApp").controller("AccountCtrl",["$scope","user","Auth","Ref","$firebaseObject","$timeout",function(a,b,c,d,e,f){function g(a){i(a,"danger")}function h(a){i(a,"success")}function i(b,c){var d={text:b+"",type:c};a.messages.unshift(d),f(function(){a.messages.splice(a.messages.indexOf(d),1)},1e4)}a.user=b,a.logout=function(){c.$unauth()},a.messages=[];var j=e(d.child("users/"+b.uid));j.$bindTo(a,"profile"),a.changePassword=function(b,d,e){a.err=null,b&&d?d!==e?g("Passwords do not match"):c.$changePassword({email:j.email,oldPassword:b,newPassword:d}).then(function(){h("Password changed")},g):g("Please enter all fields")},a.changeEmail=function(b,d){a.err=null,c.$changeEmail({password:b,newEmail:d,oldEmail:j.email}).then(function(){j.email=d,j.$save(),h("Email changed")})["catch"](g)}}]),angular.module("bookSearchApp").directive("ngShowAuth",["Auth","$timeout",function(a,b){return{restrict:"A",link:function(c,d){function e(){b(function(){d.toggleClass("ng-cloak",!a.$getAuth())},0)}d.addClass("ng-cloak"),a.$onAuth(e),e()}}}]),angular.module("bookSearchApp").directive("ngHideAuth",["Auth","$timeout",function(a,b){return{restrict:"A",link:function(c,d){function e(){b(function(){d.toggleClass("ng-cloak",!!a.$getAuth())},0)}d.addClass("ng-cloak"),a.$onAuth(e),e()}}}]),angular.module("bookSearchApp").config(["$routeProvider","SECURED_ROUTES",function(a,b){a.whenAuthenticated=function(c,d){return d.resolve=d.resolve||{},d.resolve.user=["Auth",function(a){return a.$requireAuth()}],a.when(c,d),b[c]=!0,a}}]).config(["$routeProvider",function(a){a.when("/",{template:'<book-search-form class="search"></book-search-form>'}).when("/bookList",{template:'<book-search-form class="return-search"></book-search-form>  <book-list></book-list>'}).when("/chat",{templateUrl:"views/chat.html",controller:"ChatCtrl"}).when("/readlist",{templateUrl:"views/readlist.html",controller:"ReadCtrl"}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).whenAuthenticated("/account",{templateUrl:"views/account.html",controller:"AccountCtrl"}).otherwise({redirectTo:"/bookList"})}]).run(["$rootScope","$location","Auth","SECURED_ROUTES","loginRedirectPath",function(a,b,c,d,e){function f(a){!a&&g(b.path())&&b.path(e)}function g(a){return d.hasOwnProperty(a)}c.$onAuth(f),a.$on("$routeChangeError",function(a,c,d,f){"AUTH_REQUIRED"===f&&b.path(e)})}]).constant("SECURED_ROUTES",{});