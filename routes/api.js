'use strict';
const mongoose = require('mongoose');
const IssueModel = require('../models').Issue;
const ProjectModel = require('../models').Project;

module.exports = app => {

    app.route('/api/issues/:project')

    .get((req, res) => {
        let projectName = req.params.project;
        //?open=true&assigned_to=Joe
        const {
            _id,
            open,
            issue_title,
            issue_text,
            created_by,
            assigned_to,
            status_text,
        } = req.query;

        // Aggregate query to get all issues for a project with the given parameters
        ProjectModel.aggregate([
            { $match: { name: projectName } }, // Filters the documents to pass only the documents that match the specified condition(s) to the next pipeline stage.
            { $unwind: '$issues' }, // Deconstructs an array field from the input documents to output a document for each element
            _id != undefined ? { $match: { 'issues._id': _id } } : { $match: {} },
            open != undefined ? { $match: { 'issues.open': open } } : { $match: {} },
            issue_title != undefined ? { $match: { 'issues.issue_title': issue_title } } : { $match: {} },
            issue_text != undefined ? { $match: { 'issues.issue_text': issue_text } } : { $match: {} },
            created_by != undefined ? { $match: { 'issues.created_by': created_by } } : { $match: {} },
            assigned_to != undefined ? { $match: { 'issues.assigned_to': assigned_to } } : { $match: {} },
            status_text != undefined ? { $match: { 'issues.status_text': status_text } } : { $match: {} },
        ]).exec((err, issues) => {
            if (!issues) {
                res.json([])
            } else {
                let mappedIssues = issues.map(issue => issue.issues);
                res.json(mappedIssues);
            }
        });

    })

    .post((req, res) => {
        let project = req.params.project;
        const {
            issue_title,
            issue_text,
            created_by,
            assigned_to,
            status_text,
        } = req.body;
        if (!issue_title || !issue_text || !created_by) {
            res.json({ error: 'required field(s) missing' });
            return;
        }
        const newIssue = new IssueModel({
            issue_title: issue_title || '',
            issue_text: issue_text || '',
            created_on: new Date(),
            updated_on: new Date(),
            created_by: created_by || '',
            assigned_to: assigned_to || '',
            open: true,
            status_text: status_text || '',
        });
        ProjectModel.findOne({ name: project }, (err, projectdata) => {
            if (!projectdata) {
                const newProject = new ProjectModel({ name: project });
                newProject.issues.push(newIssue);
                console.log(newProject);
                newProject.save((err, data) => {
                    if (err || !data) {
                        res.send("There was an error saving in post")
                    } else {
                        console.log("Saved new project");
                        res.json(newIssue);
                    }
                });
            } else {
                projectdata.issues.push(newIssue);
                console.log(projectdata);
                projectdata.save((err, data) => {
                    if (err || !data) {
                        res.send("There was an error saving in post")
                    } else {
                        console.log("Saved project");
                        res.json(newIssue);
                    }
                });
            }
        });
    })

    .put((req, res) => {
        let project = req.params.project;

    })

    .delete((req, res) => {
        let project = req.params.project;

    });

};