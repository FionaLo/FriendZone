
/*
FriendZone Testing and Structural Layout:

Module: FriendZone

pages:
-Admin
-Event
-Landing
-Navigation
-Profile
-Search
 */

var assert = require('assert');

var users = require('./back/user-controller.js');
var search = require('./back/search-controller.js');


describe('FriendZone tests', function() {

    describe('Admin tests', function() {

        /*//////ADMIN//////*/
        //function: getUsers()
        //function: getEvents()
        //function: getReports()

        //test both creation and returning of objects

        it('checks api/users', function(done){
            var newUser = new users.User({
                username: 'test',
                password: 'test',
                group: null
            });

            assert($http.get('api/users') != null);
            done();
        })


        it('checks api/events', function(done){
            var newEvent = search.openNewEvent();

            assert($http.get('api/events') != null);
            done();
        })


        it('checks api/reports', function(done){
            //var newEvent = new Event somehow create an event

            assert($http.get('api/events') != null);
            done();
        })

    })


    describe('Event tests', function() {

        /*//////EVENT//////*/
        //function:
        //function:
        //function:
        //function:
        //var:
        //var:
        //var:
        //var:


    })


    describe('Landing tests', function(){

        /*//////LANDING//////*/

        it('returns new user', function(done){
            var newUser = new users.User({
                username: 'test',
                password: 'test',
                group: null
            });

            assert(newUser != null);
            done();
        })

    })


    describe('Navigation tests', function(){

        /*//////NAVIGATION//////*/
        //function:
        //function:
        //function:
        //function:
        //var:
        //var:
        //var:
        //var:

    })


    describe('Profile tests', function (){

        /*//////PROFILE//////*/
        //function:
        //function:
        //function:
        //function:
        //var:
        //var:
        //var:
        //var:


    })


    describe('Search tests', function(){

        /*//////SEARCH//////*/
        //function: updateUserList()
        //function: openNewEvent()
        //function: openInviteModal
        //function:
        //var:
        //var:
        //var:
        //var:

    })





})