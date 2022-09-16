const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { Issue, Project } = require('../models');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
chai.use(chaiHttp);




suite('Functional Tests', function () {


    // Create an issue with every field: POST request to /api/issues/{project}

    test('1. POST request to /api/issues/{project} .', function (done) {
        chai
            .request(server)
            .post('/api/issues/functional')
            .send({
                "issue_title": "1.functional test @" + new Date(),
                "issue_text": "this is a test.",
                "created_by": "mick",
                "assigned_to": "big joe",
                "status_text": "goosed"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json')
                assert.exists(res.body.issue_title, "1.functional test @");
                assert.equal(res.body.issue_text, "this is a test.");
                assert.equal(res.body.created_by, "mick");
                assert.equal(res.body.assigned_to, "big joe");
                assert.equal(res.body.status_text, "goosed");

                done();
            });
    });

    // Create an issue with only required fields: POST request to /api/issues/{project}

    test('2. POST request to /api/issues/{project} .', function (done) {
        chai
            .request(server)
            .post('/api/issues/functional')
            .send({
                "issue_title": "2.functional test @" + new Date(),
                "issue_text": "this is a test.",
                "created_by": "mick"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json')
                assert.exists(res.body.issue_title, "2.functional test @");
                assert.equal(res.body.issue_text, "this is a test.");
                assert.equal(res.body.created_by, "mick");

                done();
            });
    });

    // Create an issue with missing required fields: POST request to /api/issues/{project}

    test('3. Missing Field: POST request to /api/issues/{project} .', function (done) {
        chai
            .request(server)
            .post('/api/issues/functional')
            .send({
                "issue_title": "3.functional test @" + new Date(),
                "created_by": "mick"
            })
            .end(function (err, res) {

                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json')
                assert.equal(res.body.error, "required field(s) missing");
                done();
            });
    });

    // View issues on a project: GET request to /api/issues/{project}

    test('4. View issues on a project /api/issues/{project} .', function (done) {
        chai
            .request(server)
            .get('/api/issues/functional')

            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                done();
            });
    });

    // View issues on a project with one filter: GET request to /api/issues/{project}

    test('5. View issues on a project with one filter /api/issues/{project} .', function (done) {
        chai
            .request(server)
            .get('/api/issues/functional?status_text=goosed')

            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                done();
            });
    });


    // View issues on a project with multiple filters: GET request to /api/issues/{project}

    test('6. View issues on a project with multiple filters /api/issues/{project} .', function (done) {
        chai
            .request(server)
            .get('/api/issues/functional?status_text=goosed&created_by=mick')

            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                done();
            });
    });

    // Update one field on an issue: PUT request to /api/issues/{project}

    test('7. PUT request to /api/issues/{project}', function (done) {
        let the_issue = new Issue({
            issue_title: "7.Test",
            issue_text: "Hello there",
            created_by: "a computer"
        });

        Project.findOne({ name: "functional" }, (err, projectdata) => {


            projectdata.issue.push(the_issue);
            projectdata.save((err, data) => {
                if (!err) {
                    chai
                        .request(server)
                        .put('/api/issues/functional' )
                        .send({
                            "_id": ObjectId(the_issue._id).valueOf(),
                            "issue_text": "Goodbye update."
                            
                        })
                        .end(function (err, res) {
                            //console.log("hello:", res.body)
                            assert.equal(res.status, 200);
                            assert.equal(res.type, 'application/json')
                            assert.equal(res.body.result, "successfully updated");
                            assert.equal(res.body._id, ObjectId(the_issue._id).valueOf());
                            assert.notExists(res.body.error, "");
                            done();
                        });

                }

            })
        })
    });

    // Update multiple fields on an issue: PUT request to /api/issues/{project}

test('8. PUT request to /api/issues/{project}', function (done) {
        let the_issue = new Issue({
            issue_title: "8.Test",
            issue_text: "Hello there",
            created_by: "a computer"
        });

        Project.findOne({ name: "functional" }, (err, projectdata) => {


            projectdata.issue.push(the_issue);
            projectdata.save((err, data) => {
                if (!err) {
                    chai
                        .request(server)
                        .put('/api/issues/functional' )
                        .send({
                            "_id": ObjectId(the_issue._id).valueOf(),
                            "issue_title": "8.Update test",
                            "issue_text": "Goodbye.",
                            "created_by": "This test"
                        })
                        .end(function (err, res) {
                            //console.log("hello:", res.body)
                            assert.equal(res.status, 200);
                            assert.equal(res.type, 'application/json')
                            assert.equal(res.body.result, "successfully updated");
                            assert.equal(res.body._id, ObjectId(the_issue._id).valueOf());
                            assert.notExists(res.body.error, "");
                            done();
                        });

                }

            })
        })
    });

    // Update an issue with missing _id: PUT request to /api/issues/{project}

    test('9. PUT request to /api/issues/{project} with missing id', function (done) {
        let the_issue = new Issue({
            issue_title: "9.Test missing id",
            issue_text: "This text will not change",
            created_by: "a computer"
        });

        Project.findOne({ name: "functional" }, (err, projectdata) => {


            projectdata.issue.push(the_issue);
            projectdata.save((err, data) => {
                if (!err) {
                    chai
                        .request(server)
                        .put('/api/issues/functional' )
                        .send({
                            "issue_title": "9.Update test",
                            "issue_text": "Goodbye.",
                            "created_by": "This test"
                        })
                        .end(function (err, res) {
                            //console.log("hello:", res.body)
                            assert.equal(res.status, 200);
                            assert.equal(res.type, 'application/json')
                            assert.notEqual(res.body.result, "successfully updated");
                            assert.equal(res.body.error, "missing _id");
                            done();
                        });

                }

            })
        })
    });

    // Update an issue with no fields to update: PUT request to /api/issues/{project}

    test('10. PUT request to /api/issues/{project} with no updateed fields', function (done) {
        let the_issue = new Issue({
            issue_title: "8.Test",
            issue_text: "Hello there",
            created_by: "a computer"
        });

        Project.findOne({ name: "functional" }, (err, projectdata) => {


            projectdata.issue.push(the_issue);
            projectdata.save((err, data) => {
                if (!err) {
                    chai
                        .request(server)
                        .put('/api/issues/functional' )
                        .send({
                            "_id": ObjectId(the_issue._id).valueOf()
                        })
                        .end(function (err, res) {
                           // console.log("hello:", res.body)
                            assert.equal(res.status, 200);
                            assert.equal(res.type, 'application/json')
                            assert.equal(res.body.error, "no update field(s) sent");
                            assert.equal(res.body._id, ObjectId(the_issue._id).valueOf());
                            done();
                        });

                }

            })
        })
    });


    // Update an issue with an invalid _id: PUT request to /api/issues/{project}

    test('11. PUT request to /api/issues/{project}', function (done) {
        let the_issue = new Issue({
            issue_title: "11.Invalid id test",
            issue_text: "Hello there",
            created_by: "a computer"
        });

        Project.findOne({ name: "functional" }, (err, projectdata) => {


            projectdata.issue.push(the_issue);
            projectdata.save((err, data) => {
                if (!err) {

                    let incorrectId = ObjectId(the_issue._id).valueOf()+11
                    chai
                        .request(server)
                        .put('/api/issues/functional' )
                        .send({
                            "_id": incorrectId,
                            "issue_title": "11. Invalid id test",
                            "issue_text": "Goodbye.",
                            "created_by": "This test"
                        })
                        .end(function (err, res) {
                            //console.log("hello:", res.body)
                            assert.equal(res.status, 200);
                            assert.equal(res.type, 'application/json')
                            assert.equal(res.body.error, "could not update");
                            assert.equal(res.body._id, incorrectId);
                            
                            done();
                        });

                }

            })
        })
    });

    // Delete an issue: DELETE request to /api/issues/{project}

    test('12. PUT request to /api/issues/{project}', function (done) {
        let the_issue = new Issue({
            issue_title: "12.Test delete",
            issue_text: "Hello there",
            created_by: "a computer"
        });

        Project.findOne({ name: "functional" }, (err, projectdata) => {


            projectdata.issue.push(the_issue);
            projectdata.save((err, data) => {
                if (!err) {
                    chai
                        .request(server)
                        .delete('/api/issues/functional')
                        .send({
                            "_id": ObjectId(the_issue._id).valueOf()
                        })
                        .end(function (err, res) {
                            //console.log("hello:", res.body)
                            assert.equal(res.status, 200);
                            assert.equal(res.type, 'application/json')
                            assert.equal(res.body.result, "successfully deleted");
                            assert.equal(res.body._id, ObjectId(the_issue._id).valueOf());
                            assert.notExists(res.body.error, "");
                            done();
                        });

                }

            })
        })
    });

    // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}

    test('13. PUT request to /api/issues/{project}', function (done) {
        let the_issue = new Issue({
            issue_title: "13.Invalid id test to delete req",
            issue_text: "Hello there",
            created_by: "a computer"
        });

        Project.findOne({ name: "functional" }, (err, projectdata) => {


            projectdata.issue.push(the_issue);
            projectdata.save((err, data) => {
                if (!err) {

                    let incorrectId = ObjectId(the_issue._id).valueOf()+11
                    chai
                        .request(server)
                        .delete('/api/issues/functional' )
                        .send({
                            "_id": incorrectId,
                        })
                        .end(function (err, res) {
                            //console.log("hello:", res.body)
                            assert.equal(res.status, 200);
                            assert.equal(res.type, 'application/json')
                            assert.equal(res.body.error, "could not delete");
                            assert.equal(res.body._id, incorrectId);
                            
                            done();
                        });

                }

            })
        })
    });

    // Delete an issue with missing _id: DELETE request to /api/issues/{project}

    test('14. PUT request to /api/issues/{project}', function (done) {
        let the_issue = new Issue({
            issue_title: "14.Missing id test to delete req",
            issue_text: "Hello there",
            created_by: "a computer"
        });

        Project.findOne({ name: "functional" }, (err, projectdata) => {


            projectdata.issue.push(the_issue);
            projectdata.save((err, data) => {
                if (!err) {

                    let incorrectId = "";
                    chai
                        .request(server)
                        .delete('/api/issues/functional' )
                        .send({
                            "_id": incorrectId,
                        })
                        .end(function (err, res) {
                            //console.log("hello:", res.body)
                            assert.equal(res.status, 200);
                            assert.equal(res.type, 'application/json')
                            assert.equal(res.body.error, "missing _id");
                            assert.notExists(res.body._id, incorrectId);
                            
                            done();
                        });

                }

            })
        })
    });


});
