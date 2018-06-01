
/**
 * Commmon Filter Helper
 *
 * @author Shubham Jolly <Shubham.9.jolly@niit.com>  
 */
var mongoose = require('mongoose');
var moment  = require('moment');
var qualityDataModel = require('../models/QualityDataModel');

/**
 * This function is used to get the quality score of Instructor
 * 
 * @author Shubham Jolly <Shubham.9.jolly@niit.com>  
 * @response jsonObject
 */
exports.getInstructorQualityScore = function(req, resp) {
    var sdate = req.body.startDate;
    var edate = req.body.endDate;
    var responseData;
    qualityDataModel.find({'sud':{ $gte:sdate, $lte:edate }},function(err, result) {
            if (err) {
                console.error(err);   
                responseData =  apiResponseFormat(true, err);
            }else{
                responseData = apiResponseFormat(false, "Data Fetched successfully", result);
            }        
        })
     return resp.send(responseData);
}

var apiResponseFormat = function(flag, errMessage, data){
    var response =  {};
    response.errorYN = flag;
    response.message = (errMessage) ? errMessage : "Something Internal Broke!";
    response.data =  (typeof data === 'undefined') ? {} : data;
    return response;  
}