var mongoose = require('mongoose');
var filterHelper = require('../helper/FilterHelper');
var qualityDataModel = require('../models/QualityDataModel');
var filterSchema = mongoose.Schema({});
var graphdata = mongoose.model('quality_data', filterSchema);
var accuracy = mongoose.model('sentiment', filterSchema);
var prjData = mongoose.model('project', filterSchema);


var chunk = require('lodash.chunk');

module.exports = function (app, passport) {
    /* GET home page. */
	
	app.get('/', isAuthenticated, function (req, res) {
		
        res.redirect('/report/botreport');
    });

	/* Handle Login POST */
    app.post('/gotologin', passport.authenticate('login', {
		
        successRedirect: '/report/botreport',
        failureRedirect: '/login',
        failureFlash: true
    }));
	
	app.get('/testArray', function (req, res) {
		console.log("*****/testArray******");
		console.log(chunk(['a', 'b', 'c', 'd'], 2));
		
    });

    app.get('/login', function (req, res) {
		if(!req.user){
        res.render('template/login', {
            message: req.flash('message')
        });
        }else{
        res.redirect('/report/botreport');
        }
    });

    app.get('/logout', function (req, res) {
        req.logout();
		req.session.login = null;
        res.redirect('/login');
    });

    app.get('/signup', function (req, res) {
        res.render('template/signup', {
            message: req.flash('message')
        });
    });

    /* Handle Registration POST */
    app.post('/signup', passport.authenticate('signup', {
        successRedirect: '/login',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/report/botreport', isAuthenticated, function (req, res) {
        res.render('template/report/botReport/botReport');
		
    });

    
    // parameter middleware that will run before the next routes
    app.param('path', function (req, res, next, path) {
        next();
    });

    // function to redirect on pages 
    // app.post('/botreport/:path', function (req, res) {
        // console.log(req.path);
        // if (req.path == '/botreport/report') {
            // var jsonArry = { titleName: ""};
            // getInitialGraphData(graphdata, function (err, filterDropDownData) {
                // jsonArry.data = filterDropDownData;
                // getInitialGraphData(accuracy, function (err, filterDropDownData) {
                    // jsonArry.acc = filterDropDownData;
                    // res.json({message: jsonArry});
                // })
            // })

        // }    
    // });
	
	app.post('/botreport/:path', function (req, res) {
        console.log(req.path);
        if (req.path == '/botreport/report') {
            var jsonArry = { titleName: ""};
            getAllDataWithNoFilter(prjData, function (err, filteredData) {
				
                jsonArry.data = filteredData;
				
               res.json({message: jsonArry});
            })

        }    
    });

    


}
// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
	//console.log("-------------------------isAunthenticated function called-----------------------");
    if (req.isAuthenticated())
        return next();
    //   if (req.session.ruid != undefined && req.session.ruid != null && req.session.ruid != '')
    // 	  return next();
    res.redirect('/login');
}


function getAllDataWithNoFilter(collectionName, callback) {
    collectionName.find({}, {
        '_id': 0
    }, function (err, reg) {
        if (err) return console.error(err);
        callback(null, reg);
    }).sort( { rgdt: 1 } )
}

function getSkillInitialGraphData(collectionName, callback) {
    collectionName.find({
        "ust": "Active"
    }, {
            '_id': 0
        }, function (err, reg) {
            if (err) return console.error(err);
            callback(null, reg);
        })
}

function getSkillMatrixData(collectionName, sdate, edate, callback) {
    collectionName.find({
        'ced': {
            $gte: sdate,
            $lte: edate
        },
        "ust": "Active"
    }, function (err, reg) {
        if (err) return console.error(err);
        callback(null, reg);
    })
}
/**
 * Common function to get data on Date Selection 
 * 
 */
function getDatePickerData(collectionName, sdate, edate, filterColumn, callback) {
    var query = {};
    query[filterColumn] = { $gte: sdate, $lte: edate };
    collectionName.find(query, {'_id': 0 },function (err, reg) {
        if (err) return console.error(err);
        callback(null, reg);
    })
}