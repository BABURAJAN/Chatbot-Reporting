//# dc.js Getting Started and How-To Guide
'use strict';

/* jshint globalstrict: true */
/* global dc,d3,crossfilter,colorbrewer */

// ### Create Chart Objects

// Create chart objects associated with the container elements identified by the css selector.
// Note: It is often a good idea to have these objects accessible at the global scope so that they can be modified or
// filtered by other page controls.
var ndx, start, end, tableNdx;

Array.prototype.sortObject = function(key) {      
    var array = this.sort(function(a,b) {return (a[key] < b[key]) ? 1 : ((b[key] < a[key]) ? -1 : 0);} );
    return array;

}

var dataTableChart = dc.tableview("#clickstream");	
var uniqueUserChart = dc.numberDisplay("#uniqueUsers");	
var repeatUserChart = dc.numberDisplay("#repeatUsers");	
var browserChart = dc.rowChart("#browser-chart");	
var operatingChart = dc.rowChart("#operating-chart");
var machineChart = dc.rowChart("#machine-chart");
var countryChart = dc.rowChart("#country-chart");
//var linearUserChart = dc.lineChart('#user-stat-chart');
var pageTrackingChart = dc.rowChart("#page-click-chart");

//Project type dropdown 
var projectSlugRef = $("#project_type");
var baseUrl = $("#baseurl").val();
projectSlugRef.change(function(){
    var selectedvalue = projectSlugRef.val().trim();
    if(selectedvalue !=""){
      window.location = baseUrl+"/usage/"+selectedvalue;
    }
});

function getBrowserInfo(userAgent, count){
    // or parsing a given UA string
    var info = platform.parse(userAgent);
    // info.name; // 'Opera'
    // info.version; // '11.52'
    // info.layout; // 'Presto'
    // info.os; // 'Mac OS X 10.7.2'
    // info.description; // 'Opera 11.52 (identifying as Firefox 4.0) on Mac OS X 10.7.2'
    // if(count>1){
    //     info.product = "Desktop";
    // }        
    // else{
    //     info.product = "Mobile";
    // } 
    if(!info.product)
    info.product = "Desktop";   
    return info;
}

function drawTableView(rawData){
    //console.log(JSON.stringify(rawData))
    $(".custom-card, h3.graph-title").css("display", "unset");
    var dateFormat = d3.time.format('%d/%m/%Y');
    var getCustomDateDisplay = d3.time.format('%a, %d %b %Y');
    var getCustomTime = d3.time.format("%H:%M %p, %Z");       
    var count = 5;
    rawData.forEach(function(x) {
        var dateObject = new Date(x.tm);                
        x.userCustomDate = dateFormat(dateObject);                                     
        x.customDisplayDate = getCustomDateDisplay(dateObject);  
        x.customDisplayTime = getCustomTime(dateObject);                
        x.broswerInfo = getBrowserInfo (x.pt.ua, count);       
        if(x.pt.title.length > 32){
            x.customTitle = x.pt.title.substring(0, 32) + '...';
        }else{
            x.customTitle = x.pt.title;
        }                    
         count--;
    });
    
    tableNdx = crossfilter(rawData);
    var tableDimesion = tableNdx.dimension(function(d) { 
        return (d.pt.un) ? d.pt.un : "N/A";
    });
    var operatingDimesion = tableNdx.dimension(function(d) { return d.broswerInfo.os.family;});
    var machineDimesion = tableNdx.dimension(function(d) { return d.broswerInfo.product;});
    var browserDimesion = tableNdx.dimension(function(d) { return d.broswerInfo.name;});
    var locationDimesion = tableNdx.dimension(function(d) { return d.country;});
    var browserGroup = browserDimesion.group();
    var tableGroup = tableDimesion.group();    
    var pageStatisticsDimesion = tableNdx.dimension(function(d) { return d.customTitle;});
    var userStastics = tableNdx.groupAll().reduce(
        function addUserCount(p,v) {
            if (p.usersID.indexOf(v.pt.un) == -1) {
                 ++p.unique
                p.usersID.push(v.pt.un);            
            }else{
                ++p.repeated;
            }
            return p;
        },
        function removeUserCount(p,v) {
            if(p.repeated == 0 ) return  p;
            if (p.usersID.indexOf(v.pt.un) != -1) {
                --p.unique
                p.usersID.splice(p.usersID.indexOf(v.pt.un),1);
            }else{
                --p.repeated;
            }
            return p;
        },
        function initUserCount() {
          return {unique:0, repeated:0, usersID:[]};
        }
    );
    var getUniqueUsersCount = function(d){       
        return d.unique;
    }
    var getRepeatedUsersCount = function(d){
        return d.repeated;
    } 

    dataTableChart
        .dimension(tableDimesion)
        .group(tableGroup)
        .columns([
            { title: "USER",   render: function(data, type, row) { 
                //console.log("\n",row.pt.un);            
                return (row.pt.un) ? row.pt.un : "N/A" }}   ,
            { title: "DATE", data: "customDisplayDate" },
            { title: "TIME", data: "customDisplayTime"},
            { title: "PAGETITLE", data: "pt.title" },
            { title: "IP", data:  "pt.ip" }
        ])
        .enableColumnReordering(true)
        .enablePagingSizeChange(true)
        .enablePaging(true)
        .enableSearch(true)
        .rowId("pt.un")
        .showGroups(true)
        .fixedHeader(false)
        .enableAutoWidth(true)
        .buttons([{ extend: 'excelHtml5', title: 'Usage Tracking'}])
                 
    
    uniqueUserChart
        .formatNumber(d3.format(".1"))
        .group(userStastics)
        .valueAccessor(getUniqueUsersCount);        
    
    repeatUserChart
        .formatNumber(d3.format(".1"))
        .group(userStastics)
        .valueAccessor(getRepeatedUsersCount);        
    
    browserChart
        .height(180)    
        .elasticX(true)
        .dimension(browserDimesion)
        .group(browserGroup)
        .renderTitleLabel(true)
        .title(function (d) {return d.value;});

    operatingChart        
        .height(180)
        .elasticX(true)
        .group(operatingDimesion.group())
        .dimension(operatingDimesion)
        .renderTitleLabel(true)
        .title(function (d) {return d.value;});

    machineChart
        .height(180)
        .elasticX(true)
        .dimension(machineDimesion)
        .group(machineDimesion.group())
        .renderTitleLabel(true)  
        .title(function (d) {return d.value;});  

    countryChart
        .height(180)
        .elasticX(true)
        .dimension(locationDimesion)
        .group(locationDimesion.group())  
        .renderTitleLabel(true)  
        .title(function (d) {return d.value;});
    
    pageTrackingChart
        .height(180)
        .elasticX(true)
        .dimension(pageStatisticsDimesion)
        // .data(function(group) {
        //     var item = group.all(),rest;
        //     var items = [];
        //     var tmp = [];
        //     if (item.length > 0) {
        //         for (var i = 0; i < item.length; i++) {
        //             if(item[i].key.length > 32){
        //                 item[i].key = item[i].key.substring(0, 32) + '...';
        //             }                    
        //         }
        //     }
        //     // var i = item.sortObject("value");
        //     // return i;
        // })         

        .group(pageStatisticsDimesion.group())  
        .renderTitleLabel(true)  
        .title(function (d) {return d.value;});
    dc.renderAll();  
    dc.redrawAll(); 
}

function redrawDataTable(dataSource){
    var tableNdx = crossfilter(dataSource);
    var tableDimesion = tableNdx.dimension(function(d) {return d.pt.un;});
    var tableGroup = tableDimesion.group(); 
    dataTableChart
    .dimension(tableDimesion)
    .group(tableGroup)
    .columns([
        { title: "USER", data:  "pt.un" },
        { title: "DATE", render: function(data, type, row) { return new Date(row.tm).toDateString(); }},
        { title: "TIME", render: function(data, type, row) { return msToTime(new Date(row.tm));}},
        { title: "PAGETITLE", data: "pt.url" },
        { title: "IP", data:  "pt.ip" }
    ])
    .enableColumnReordering(true)
    .enablePagingSizeChange(true)
    .enablePaging(true)
    .enableSearch(true)
    .rowId("pt.un")
    .showGroups(true)
    .fixedHeader(true)
    .buttons(["excel"])
    .sortBy([["pt.un", "desc"]]);         

    dc.redrawAll();                            
}

$(function() {
    $('input[name="daterange"]').daterangepicker({
        locale: {
            cancelLabel: 'Clear',
            applyLabel: 'Submit'
        }
    });

});


$('input[name="daterange"]').on('apply.daterangepicker', function(ev, picker) {
    start = picker.startDate.format('MM/DD/YYYY');
    end = picker.endDate.format('MM/DD/YYYY');
    getUserData(start, end);
});

$('input[name="daterange"]').on('cancel.daterangepicker', function(ev, picker) {
    $(this).val('');
});

function getUserData(start, end){
    $.ajax({
        url: "/clickstrmdtrange",
        dataType:'JSON',
        type : "POST",
        data: JSON.stringify({startDate: start, endDate: end, "project_slug" : projectSlugRef.val()}),
        contentType: "application/json; charset=utf-8",
        success: function(data){          
            drawTableView(data.message.data);			
        }
	});
}
window.onresize = function(event) {
    var newWidth = document.getElementById('browser-chart').offsetWidth;
    browserChart.width(newWidth).transitionDuration(0);
    browserChart.redraw();

    var newWidth1 = document.getElementById('operating-chart').offsetWidth;
    operatingChart.width(newWidth1).transitionDuration(0);
    operatingChart.redraw();

    var newWidth2 = document.getElementById('machine-chart').offsetWidth;
    machineChart.width(newWidth2).transitionDuration(0);
    machineChart.redraw();

    var newWidth3 = document.getElementById('country-chart').offsetWidth;
    countryChart.width(newWidth3).transitionDuration(0);
    countryChart.redraw();

    var newWidth3 = document.getElementById('page-click-chart').offsetWidth;
    pageTrackingChart.width(newWidth3).transitionDuration(0);
    pageTrackingChart.redraw();
};