'use strict';
const mongoose = require('mongoose');
const IssueModel = require('../models').Issue;
const ProjectModel = require('../models').Project;

module.exports = app => {

    app.route('/api/issues/:project')

    .get((req, res) => {
        let project = req.params.project;

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