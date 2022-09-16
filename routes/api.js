'use strict';
const mongoose = require("mongoose");
const IssueModel = require("../models").Issue;
const ProjectModel = require("../models").Project;
const ObjectId = mongoose.Types.ObjectId;

const { text } = require("body-parser");

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;

      const {
        _id,
        open,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      
      } = req.query;

      ProjectModel.aggregate([
        { $match: { name: project} },
        { $unwind: "$issue"},
        _id != undefined
        ? { $match: {"issue._id": ObjectId(_id)} }
        : { $match: {} },
        open != undefined
        ? { $match: {"issue.open": open } }
        : { $match: {} },
        issue_title != undefined
        ? { $match: {"issue.issue_title": issue_title } }
        : { $match: {} },
        issue_text != undefined
        ? { $match: {"issue.issue_text": issue_text } }
        : { $match: {} },
        created_by != undefined
        ? { $match: {"issue.created_by": created_by } }
        : { $match: {} },
        assigned_to != undefined
        ? { $match: {"issue.assigned_to": assigned_to } }
        : { $match: {} },
        status_text != undefined
        ? { $match: {"issue.status_text": status_text } }
        : { $match: {} },
      ]).exec((err, data) => {
        if(!data){
        res.json([]);
        }
        else{

        
        
        let mappedData = data.map((item) => item.issue);

        res.json(mappedData);
        }
      })

    })

    .post(function (req, res) {
      let project = req.params.project;
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.body;
      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: "required field(s) missing" });
        return;
      }
      const newIssue = new IssueModel({
        issue_title: issue_title || "",
        issue_text: issue_text || "",
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by || "",
        assigned_to: assigned_to || "",
        open: true,
        status_text: status_text || "",
      });


      ProjectModel.findOne({ name: project }, (err, projectdata) => {
        if (!projectdata) {
          const newProject = new ProjectModel({ name: project });
          newProject.issue.push(newIssue);
          newProject.save((err, data) => {
            if (err || !data) {
              res.send("There was an error saving in post");
            } else {
              res.json(newIssue);
            }
          });
        } else {
          projectdata.issue.push(newIssue);
          projectdata.save((err, data) => {
            if (err || !data) {
              res.send("There was an error saving in post");
            } else {
              res.json(newIssue);
            }
          })
        }
      });
    })
    
    .put(function (req, res) {
        let project = req.params.project;

        const {
          _id,
          issue_title,
          issue_text,
          created_by,
          assigned_to,
          status_text,
          open,
        } = req.body;
        if(!_id){
          res.json({error: "missing _id"});
          return;
        }
        if(
          !issue_title &&
          !issue_text &&
          !created_by &&
          !assigned_to &&
          !status_text &&
          !open
        ){
          res.json({error: "no update field(s) sent", _id: _id});
          return;
        }
        ProjectModel.findOne({ name:project}, (err,projectdata) =>{
          if(err || !projectdata){
            res.json({error: "could not update", _id: _id})
          }
          else{
            const issueData = projectdata.issue.id(_id);
            if(!issueData){
              res.json({error: "could not update", _id: _id});
              return;
            }
            issueData.issue_title = issue_title || issueData.issue_title;
            issueData.issue_text = issue_text || issueData.issue_text;
            issueData.created_by = created_by || issueData.created_by;
            issueData.assigned_to = assigned_to || issueData.assigned_to;
            issueData.status_text = status_text || issueData.status_text;
            issueData.updated_on = new Date();
            issueData.open = open;
            projectdata.save((err, data) =>{
              if(err|| !data){
                res.json({error: "could not update", _id: _id});
              }
              else{
                res.json({  result: 'successfully updated', '_id': _id } )
              }
            })
          }
        })
      })

        .delete(function (req, res) {
          let project = req.params.project;

          const { _id} = req.body;
           if(!_id){
            res.json({ error: 'missing _id' });
            return;
           }
           ProjectModel.findOne({name: project},(err, projectdata) =>{
            if(!projectdata || err){
              res.send({error: "could not delete", _id: _id});
            }
            else{
              const issueData = projectdata.issue.id(_id);
              if(!issueData){
                res.send({error: "could not delete", _id: _id })
                return;
              }
              issueData.remove();

            projectdata.save((err, data) =>{
              if(err || !data){
                res.json({error: "could not delete",_id: issueData._id});
              }
              else{
                res.json({ result: 'successfully deleted', '_id': issueData._id });
              }
            })
            }
           })

        });



    };
