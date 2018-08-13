(function() {
    "use strict";

    var usStates = {
        AL: "ALABAMA",AK: "ALASKA",AS: "AMERICAN SAMOA",AZ: "ARIZONA",AR: "ARKANSAS",CA: "CALIFORNIA",CO: "COLORADO",
        CT: "CONNECTICUT",DE: "DELAWARE",DC: "DISTRICT OF COLUMBIA",FM: "FEDERATED STATES OF MICRONESIA",FL: "FLORIDA",
        GA: "GEORGIA",GU: "GUAM",HI: "HAWAII",ID: "IDAHO",IL: "ILLINOIS",IN: "INDIANA",IA: "IOWA",KS: "KANSAS",KY: "KENTUCKY",
        LA: "LOUISIANA",ME: "MAINE",MH: "MARSHALL ISLANDS",MD: "MARYLAND",MA: "MASSACHUSETTS",MI: "MICHIGAN",MN: "MINNESOTA",
        MS: "MISSISSIPPI",MO: "MISSOURI",MT: "MONTANA",NE: "NEBRASKA",NV: "NEVADA",NH: "NEW HAMPSHIRE",NJ: "NEW JERSEY",
        NM: "NEW MEXICO",NY: "NEW YORK",NC: "NORTH CAROLINA",ND: "NORTH DAKOTA",MP: "NORTHERN MARIANA ISLANDS",OH: "OHIO",
        OK: "OKLAHOMA",OR: "OREGON",PW: "PALAU",PA: "PENNSYLVANIA",PR: "PUERTO RICO",RI: "RHODE ISLAND",SC: "SOUTH CAROLINA",
        SD: "SOUTH DAKOTA",TN: "TENNESSEE",TX: "TEXAS",UT: "UTAH",VT: "VERMONT",VI: "VIRGIN ISLANDS",VA: "VIRGINIA",
        WA: "WASHINGTON",WV: "WEST VIRGINIA",WI: "WISCONSIN",WY: "WYOMING"};

    var submittedAddresses = [];
    var shareAddress = {};
    var files = [];

    angular.module('contactApp', ['files', 'ngRoute', 'LocalStorageModule', 'ngMap'])
        .config(function($routeProvider, $locationProvider) {
            $routeProvider.when('/', {
                templateUrl: 'views/contactList.html',
                controller: 'contactListController'
            }).when('/contact', {
                templateUrl: 'views/contact.html',
                controller: 'contactController'
            }).when('/contact/:id', {
                templateUrl: 'views/contact.html',
                controller: 'contactController'
            });
            $locationProvider.html5Mode(false);
            $locationProvider.hashPrefix('!');
        })

        .factory("submittedAddresses",function (){
            var submittedAddresses = [];
            return submittedAddresses;
        })

        .config(function (localStorageServiceProvider) {
            localStorageServiceProvider
                .setPrefix('08724.hw5');
        })

        .controller('contactListController', function($scope, localStorageService, $routeParams, $location, address) {

            $scope.submittedAddresses = submittedAddresses;

            $scope.addContack = function() {
                shareAddress = {
                    firstName: '',
                    lastName: '',
                    email: '',
                    phonenumber:'',
                    address:'',
                    city:'',
                    zip:'',
                    photo:''
                };
                files = [];
                $location.path("/contact")
            };

            $scope.removeAddress = function(address) {
                var id = address.id;
                var imageId = id.substring(10);
                angular.forEach($scope.submittedAddresses, function(u, i) {
                    if (u.id == id ) {
                        $scope.submittedAddresses.splice(i, 1);
                    }
                });
                localStorage.removeItem(id);
                localStorage.removeItem(imageId+"_image");
                localStorage.removeItem(imageId+"_image_name");
                localStorage.removeItem(imageId+"_image_type");
            };

            $scope.editInfo = function(address){
                // set the share Address to specific
                shareAddress = JSON.parse(localStorage.getItem(address.id));
                var imageId = address.id.substring(10);
                if (localStorage.getItem(imageId +"_image") != null){
                    var blob = new Blob([localStorage.getItem(address.id+"_image")], {type: localStorage.getItem(address.id+"_image_type")});
                    var newFile =  {
                        fileData: localStorage.getItem(imageId +"_image"),
                        fileType: localStorage.getItem(imageId +"_image_type"),
                        fileName: localStorage.getItem(imageId +"_image_name")
                    };
                    files[0] = newFile;
                }else{
                    files =[];
                }
                $location.path("/contact/"+address.id);
            };

            function init(){
                var length = localStorage.length;
                if ($scope.submittedAddresses.length == 0) {
                    for (var i = 0; i < length; i++) {
                        var key = localStorage.key(i);

                        try {
                            $scope.submittedAddresses.push(JSON.parse(localStorage.getItem(key)));
                        } catch(err) {
                        }
                    }
                }

            };

            init();

        })

        .factory("address",function (){
            var address = {
                firstName: '',
                lastName: '',
                email: '',
                phonenumber:'',
                address:'',
                city:'',
                zip:'',
                photo:''
            }

            return address;
        })

        .controller('contactController',function($scope, localStorageService, $routeParams, $location ) {

            $scope.stateOptions = usStates;
            $scope.address = shareAddress;
            $scope.submittedAddresses = submittedAddresses;
            $scope.files = files;

            $scope.add = function() {
                var id = "08724.hw5."+$scope.address.firstName.replace(/\s/g, '').toLocaleLowerCase() + "_" + $scope.address.lastName.replace(/\s/g, '').toLocaleLowerCase();
                if ($scope.address.id == undefined) {
                    $scope.address.id = id;
                } else {
                    id = $scope.address.id;
                }

                if (localStorage.getItem(id) == undefined){
                    // save a new contact to local storage
                    $scope.submittedAddresses.push(angular.copy($scope.address));
                    // update images
                    var imageid = id.substring(10);
                    localStorage.setItem(imageid+"_image",files[0].fileData);
                    localStorage.setItem(imageid+"_image_type",files[0].fileType);
                    localStorage.setItem(imageid+"_image_name",files[0].fileName);

                    //update contact information
                    localStorage.setItem(id, JSON.stringify($scope.address));
                }else{
                    // update old contact to local storage
                    angular.forEach($scope.submittedAddresses, function(u, i) {
                        if (u.id == id ) {
                            $scope.submittedAddresses[i] = $scope.address;
                        }
                    });
                    // update images
                    var imageid = id.substring(10);
                    localStorage.setItem(imageid+"_image",files[0].fileData);
                    localStorage.setItem(imageid+"_image_type",files[0].fileType);
                    localStorage.setItem(imageid+"_image_name",files[0].fileName);
                    
                    //update contact information
                    localStorage.setItem(id, JSON.stringify($scope.address));
                }
                $scope.address = {};
                $location.path("/")
            }

        })

        .controller('fileController', function($scope, localStorageService) {
            $scope.files = files;
            $scope.shareAddress = shareAddress;
        })

})();

