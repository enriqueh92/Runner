var db = require('../../database/models');
const Promise = require('bluebird');

module.exports = {

  mapRun: (req, res, next) => {
    if (Object.keys(req.body).length) {
      req.run = req.body;
      next();
    }
  },

  getAvailableRuns: (req, res, next) => {
    // gets all available runs (no runner id)
    return db.Runs.getAllRunsWithStatus('available')
    .then((runs) => {
      res.runs = runs;
      next();
    });
  },

  getStartedRuns: (req, res, next) => {
    // NEEDS DB FUNCTION THAT GETS STARTED RUNS
    return db.Runs.getAllRunsWithStatus('started')
    .then((runs) => {
      res.runs = runs;
      next();
    });
  },

  getFinishedRuns: (req, res, next) => {
    // gets all runs that have been finished (finished status)
    return db.Runs.getAllRunsWithStatus('finished')
    .then((runs) => {
      res.runs = runs;
      next();
    });
  },

  editRun: (req, res, next) => {
    // Just in case user wants to edit details of run
    // DOES NOT CHANGE STATUS
    db.Runs.updateRun(req.run)
    .then(() => {
      next();
    });
  },

  updateRun: (req, res, next) => {
    return db.Runs.getRun(req.run)
    .then((result) => {
      if (!result.length) {
        return db.Runs.create(req.run);
      } else {
        throw result;
      }
    })
    .then(() => {
      next();
    })
    .catch((result) => {
      return db.Runs.updateStatus(result);
    })
    .then(() => {
      next();
    });
    // if no run exists
      // creates run
      // (db.Runs.create(req.run))
    // if run exists with available status
      // sets run to started
    // if run exists with started status
      // sets run to finished
        // (db.Runs.finishRun(req.run))
  }

};