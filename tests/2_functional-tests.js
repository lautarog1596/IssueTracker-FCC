const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

// Create an issue with every field: POST request to /api/issues/{project}
// Create an issue with only required fields: POST request to /api/issues/{project}
// Create an issue with missing required fields: POST request to /api/issues/{project}
// View issues on a project: GET request to /api/issues/{project}
// View issues on a project with one filter: GET request to /api/issues/{project}
// View issues on a project with multiple filters: GET request to /api/issues/{project}
// Update one field on an issue: PUT request to /api/issues/{project}
// Update multiple fields on an issue: PUT request to /api/issues/{project}
// Update an issue with missing _id: PUT request to /api/issues/{project}
// Update an issue with no fields to update: PUT request to /api/issues/{project}
// Update an issue with an invalid _id: PUT request to /api/issues/{project}
// Delete an issue: DELETE request to /api/issues/{project}
// Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
// Delete an issue with missing _id: DELETE request to /api/issues/{project}
let deleteID;
suite('Functional Tests', () => {

    suite('Routing Tests', () => {

        suite('3 POST request tests', () => {

            test('Create an issue with every field: POST request to /api/issues/{project}', done => {
                chai.request(server)
                    .post('/api/issues/projects')
                    .set('content-type', 'application/json')
                    .send({
                        issue_title: 'Issue',
                        issue_text: 'Functional Test',
                        created_by: 'FCC',
                        assigned_to: 'Chai and Mocha',
                        status_text: 'Not Done',
                    })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        deleteID = res.body._id;
                        assert.equal(res.body.issue_title, 'Issue');
                        assert.equal(res.body.issue_text, 'Functional Test');
                        assert.equal(res.body.created_by, 'FCC');
                        assert.equal(res.body.assigned_to, 'Chai and Mocha');
                        assert.equal(res.body.status_text, 'Not Done');
                        done();
                    });
            })

            test('Create an issue with only required fields: POST request to /api/issues/{project}', done => {
                chai.request(server)
                    .post('/api/issues/projects')
                    .set('content-type', 'application/json')
                    .send({
                        issue_title: 'Issue',
                        issue_text: 'Functional Test',
                        created_by: 'FCC',
                        assigned_to: '',
                        status_text: '',
                    })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.issue_title, 'Issue');
                        assert.equal(res.body.issue_text, 'Functional Test');
                        assert.equal(res.body.created_by, 'FCC');
                        assert.equal(res.body.assigned_to, '');
                        assert.equal(res.body.status_text, '');
                        done();
                    })
            })

            test('Create an issue with missing required fields: POST request to /api/issues/{project}', done => {
                chai.request(server)
                    .post('/api/issues/projects')
                    .set('content-type', 'application/json')
                    .send({
                        issue_title: '',
                        issue_text: '',
                        created_by: 'FCC',
                        assigned_to: '',
                        status_text: '',
                    })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, 'required field(s) missing');
                        done();
                    })
            })
        })


        suite('3 GET request Tests', () => {
            test('View issues on a project: GET request to /api/issues/{project}', done => {
                chai.request(server)
                    .get('/api/issues/test-data-abc123')
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.length, 4);
                        done();
                    })
            })

            test('View issues on a project with one filter: GET request to /api/issues/{project}', done => {
                chai.request(server)
                    .get('/api/issues/test-data-abc123')
                    .query({ _id: "6272841e6e7d0594be6e597e" })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.deepEqual(res.body[0], {
                            _id: "6272841e6e7d0594be6e597e",
                            issue_title: "get",
                            issue_text: "issue",
                            created_on: "2022-05-04T13:48:14.196Z",
                            updated_on: "2022-05-04T13:48:14.196Z",
                            created_by: "lau",
                            assigned_to: "",
                            open: true,
                            status_text: "",
                        });
                        done();
                    })
            })

            test('View issues on a project with multiple filters: GET request to /api/issues/{project}', done => {
                chai.request(server)
                    .get('/api/issues/test-data-abc123')
                    .query({
                        issue_title: 'get2',
                        issue_text: 'issue2'
                    })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.deepEqual(res.body[0], {
                            _id: "627284326e7d0594be6e5984",
                            issue_title: "get2",
                            issue_text: "issue2",
                            created_on: "2022-05-04T13:48:34.007Z",
                            updated_on: "2022-05-04T13:48:34.007Z",
                            created_by: "rob",
                            assigned_to: "",
                            status_text: "",
                            open: true,
                        });
                        done();
                    })
            })
        })


        suite('5 PUT request Tests', () => {
            test('Update an issue with every field: PUT request to /api/issues/{project}', done => {
                chai.request(server)
                    .put('/api/issues/test-data-put')
                    .send({
                        _id: '62728690cad1945064972d27',
                        issue_title: 'Issue',
                    })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, 'successfully updated')
                        assert.equal(res.body._id, '62728690cad1945064972d27');
                        done();
                    })
            })

            test('Update multiple fields on an issue: PUT request to /api/issues/{project}', done => {
                chai.request(server)
                    .put('/api/issues/test-data-put')
                    .send({
                        _id: '62728698cad1945064972d2d',
                        issue_title: 'Issue',
                        issue_text: 'Functional Test',
                    })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, 'successfully updated')
                        assert.equal(res.body._id, '62728698cad1945064972d2d');
                        done();
                    })
            })

            test('Update an issue with missing _id: PUT request to /api/issues/{project}', done => {
                chai.request(server)
                    .put('/api/issues/test-data-put')
                    .send({
                        issue_title: 'Issue',
                        issue_text: 'Functional Test',
                    })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, 'missing _id');
                        done();
                    })
            })

            test('Update an issue with no fields to update: PUT request to /api/issues/{project}', done => {
                chai.request(server)
                    .put('/api/issues/test-data-put')
                    .send({
                        _id: '627286d6cad1945064972d32',
                    })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, 'no update field(s) sent');
                        done();
                    })
            })

            test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', done => {
                chai.request(server)
                    .put('/api/issues/test-data-put')
                    .send({
                        _id: 'invalid_id',
                        issue_title: 'Issue',
                        issue_text: 'Functional Test',
                    })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, 'could not update');
                        done();
                    })
            })
        })


        suite('3 DELETE request Tests', () => {

            test('Delete an issue: DELETE request to /api/issues/{project}', done => {
                chai.request(server)
                    .delete('/api/issues/projects')
                    .send({
                        _id: deleteID,
                    })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, 'successfully deleted');
                        done();
                    })
            })

            test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', done => {
                chai.request(server)
                    .delete('/api/issues/projects')
                    .send({
                        _id: 'invalid_id',
                    })
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, 'could not delete');
                        done();
                    })
            })

            test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', done => {
                chai.request(server)
                    .delete('/api/issues/projects')
                    .send({})
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, 'missing _id');
                        done();
                    })
            })
        })

    })

});