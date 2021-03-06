'use strict';

require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const cookieSession = require('cookie-session');
const viewLeagueInfo = require('../db/dbFunc/getLeagueInfo');
const getCurrentYear = require('../helpers/getCurrentYear');
const createDraft = require("../db/dbFunc/createDraft");
const createDraftPicks = require("../db/dbFunc/createDraftPicks");
const getDraftPicks = require("../db/dbFunc/getDraftPicks");
const getDraftInfo = require("../db/dbFunc/getDraftInfo");
const getTeams = require('../db/dbFunc/getTeams');

module.exports = (knex) => {

  router.use(cookieSession({
        name: 'session',
        secret: process.env.SECRET
    }))

  router.get("/football/league/:leagueID/draft/create", (req, res) => {
    let getLeagueInfo = viewLeagueInfo(req.params.leagueID, knex);
    getLeagueInfo.then(function(leagueData){
      res.render("football/draft/create", {userID: req.session.userID, username: req.session.username, leagueData: leagueData});
    })
  });

  router.post("/football/league/:leagueID/draft/create", (req, res) => {
    // manual drafts don't use this field. this sets it to null if date draft
    let draftDate = null;
    if (req.body.date) {
      draftDate = req.body.date;
    }
    const newDraft = {
      league_id: req.params.leagueID,
      year: getCurrentYear(),
      rounds: req.body.rounds,
      draft_type: req.body.draftType,
      pool: req.body.pool,
      status: 'Not Started'
    }
    let addDraft = createDraft(newDraft, knex);
    addDraft.then(function(draftID) {
      let makeDraftPicks = createDraftPicks(draftID[0], knex);
      makeDraftPicks.then(function() {
        res.redirect(draftID[0]);
      })
    })
  });

  router.get("/football/league/:leagueID/draft/:draftID", (req, res) => {
    let draftPicks = getDraftPicks(req.params.draftID, knex);
    draftPicks.then(function(picks) {
      let draftInfo = getDraftInfo(req.params.draftID, knex);
      draftInfo.then(function(info) {
        let viewTeams = getTeams(req.params.leagueID, knex);
        viewTeams.then(function(teams) {
          res.render("football/draft/view", {userID: req.session.userID, username: req.session.username, picks: picks, info: info, teams: teams });
        })
      })
    })
  });

  return router;
}
