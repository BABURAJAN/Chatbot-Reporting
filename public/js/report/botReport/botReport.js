//# dc.js Getting Started and How-To Guide
'use strict';
var ndx;
/* jshint globalstrict: true */
/* global dc,d3,crossfilter,colorbrewer */

// ### Create Chart Objects

// Create chart objects associated with the container elements identified by the css selector.
// Note: It is often a good idea to have these objects accessible at the global scope so that they can be modified or
// filtered by other page controls.
var regionChart = dc.rowChart("#project");
var countChart = dc.rowChart("#count_chart");

//var questionChart = dc.rowChart("#instuctor-question");
var curriculum = dc.compositeChart("#curriculum-quality");
var speech_text = dc.compositeChart("#speech_text");

var start, end;
var totalcount = 1;
var redrawflag = false;
var flag=false;



/*var getWeekNumber = function(weekdata){
	var weeksTRING =weekdata.split('-')[0];
	return weeksTRING.split(' ')[1];	
}*/
function drawGraph(data, flag) {
   console.log("************",data);
    ndx = crossfilter(data)
	var all = ndx.groupAll();

    var regionDim = ndx.dimension(function(d) {
        return d.prj_nm;
    });
    var regionGroup = regionDim.group();
	
	var countDim = ndx.dimension(function(d) {
		            var now = new Date(d.rgdt);
					//debugger;
					//console.log(d3.time.format('%d %b %Y')(now));
					return d3.time.format('%d %b %Y')(now);
		
    });
    //var countGroup = countDim.group();
	 var countGroup = countDim.group()
        .reduceSum(function(d) {
            var rett = d.ic === null ? 0 : d.ic;
            return rett;
        });
	
	
    regionChart
       // .width(280)
        .height(320)
        .dimension(regionDim)
        .group(regionGroup)
		.title(function (d) {
			debugger;
			//return d.key + ' : '+ d.value + ",\nPercentage : "+(d.value / all.value() * 100).toFixed(2);
			return d.value;
		})
	
   countChart 
     .height(320)
     .dimension(countDim)
     .group(snap_to_zero(remove_empty_bins(countGroup)))
	 .title(function (d) {
			return d.value;
		})
		
    


	
	

	
		
    var rsrctype = ndx.dimension(function(d) {
		var now = new Date(d.rgdt);
					return d3.time.format('%d %b %Y')(now);
        //return d.wyr;
    });
	
	var rsrctype1 = ndx.dimension(function(d) {
		var now = new Date(d.rgdt);
					return d3.time.format('%d %b %Y')(now);
        //return d.wyr;
    });
	
    var rsrcGroup = rsrctype.group().reduce(
        /* callback for when data is added to the current filter results */
        function(p, v) {

           // ++p.count;
			p.events += v.ic;
            p.in_score += (v.rgc == null ? 0 : v.rgc);
            if (p.events != 0 && p.events != null) {
                p.avg_score = (p.in_score / p.events).toFixed(2);
            }
           
            return p;
        },
        /* callback for when data is removed from the current filter results */
        function(p, v) {

            //--p.count;
			p.events -= v.ic;
            p.in_score -= (v.rgc == null ? 0 : v.rgc);
            if (p.events != 0 && p.events != null) {
                p.avg_score = (p.in_score / p.events).toFixed(2);
            }
			if((p.in_score == 0 || p.in_score >= -1 )&& p.events==0){
                p.avg_score=0;
            }
            return p;

        },
        /* initialize p */
        function() {
            return {
                in_score: 0,
				avg_score:0,
               // count: 0,
                events: 0,
            };
        }
    ).order(orderValue);
	
	
    var rsrcGroup1 = rsrctype1.group().reduce(
        /* callback for when data is added to the current filter results */
        function(p, v) {

           // ++p.count;
			p.events += v.spc;
            p.in_score += (v.txtc == null ? 0 : v.txtc);
            if (p.events != 0 && p.events != null) {
                p.avg_score = ((p.in_score / p.events)*100).toFixed(2);
            }
           
            return p;
        },
        /* callback for when data is removed from the current filter results */
        function(p, v) {

            //--p.count;
			p.events -= v.spc;
            p.in_score -= (v.txtc == null ? 0 : v.txtc);
            if (p.events != 0 && p.events != null) {
                p.avg_score = ((p.in_score / p.events)*100).toFixed(2);
            }
			if((p.in_score == 0 || p.in_score >= -1 )&& p.events==0){
                p.avg_score=0;
            }
            return p;

        },
        /* initialize p */
        function() {
            return {
                in_score: 0,
				avg_score:0,
               // count: 0,
                events: 0,
            };
        }
    ).order(orderValue);
	
	

    function orderValue(p) {
        return p.count;
    }


    /*function to set stack*/
    function sel_stack(i) {
        return function(d) {
            return Number(d.value['events']);
        };
    }

    /*function to set stack*/
    function sel_stack1(i) {
        return function(d) {
            return Number(d.value['avg_score']);
        };
    }

	function sel_stack2(i) {
        return function(d) {
		  return 4;
        };
    }

    var actuals = dc.barChart(curriculum)
        .gap(5)
         .centerBar(true)
		//.barPadding(1)
		.group(remove_empty_bins(rsrcGroup), "Average Of Curriculum", sel_stack1(1))
        .colors('#6baed6')
		//.barPadding(0)
		//.outerPadding(2)
                
    var budgets = dc.lineChart(curriculum)

        .dimension(rsrctype)
        .group(remove_empty_bins(rsrcGroup), "No. of Interactions", sel_stack(1))
        .useRightYAxis(false)
        .colors('#ff7f0e')
        .renderDataPoints(true)
        .renderTitle(true)

		

    curriculum
      //  .width(850)
        .height(400)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .margins({
			top: 50,
			right: 60,
			bottom: 100,	
			left: 50
        })
        .brushOn(false)
        ._rangeBandPadding(1)
        .elasticY(true)
		.elasticX(true)
         .yAxisLabel("No. of Interactions")
         .xAxisLabel("Date")
        .rightYAxisLabel("No. of Interactions")

        .dimension(rsrctype)
        .group(remove_empty_bins(rsrcGroup), "No. of Interactions", sel_stack(1))
        .legend(dc.legend().x(550).y(20).itemHeight(13).gap(5))
        .shareTitle(false)
        .renderTitle(true)
        .compose([ budgets])
		
		/* speech to text start*/
		  var actuals1 = dc.barChart(speech_text)
        .gap(5)
         .centerBar(true)
		//.barPadding(1)
		.group(remove_empty_bins(rsrcGroup1), "% of Usages", sel_stack1(1))
        .colors('#6baed6')
		//.barPadding(0)
		//.outerPadding(2)
                
    var budgets1 = dc.lineChart(speech_text)

        .dimension(rsrctype1)
        .group(remove_empty_bins(rsrcGroup1), "Count of Usages", sel_stack(1))
        .useRightYAxis(true)
        .colors('#ff7f0e')
        .renderDataPoints(true)
        .renderTitle(true)

		

    speech_text
      //  .width(850)
        .height(400)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .margins({
			top: 50,
			right: 60,
			bottom: 100,	
			left: 50
        })
        .brushOn(false)
        ._rangeBandPadding(1)
        .elasticY(true)
		.elasticX(true)
         .yAxisLabel("% of Usages")
         .xAxisLabel("Date")
        .rightYAxisLabel("Count Of Usages")

        .dimension(rsrctype1)
        .group(remove_empty_bins(rsrcGroup1), "Count Of Events", sel_stack(1))
        .legend(dc.legend().x(550).y(20).itemHeight(13).gap(5))
        .shareTitle(false)
        .renderTitle(true)
        .compose([actuals1, budgets1])
	
		/* speech to text end*/
		
		
		
    if (flag == 0) {
		actuals.gap(5);
        dc.renderAll();
		// regionChart.render();
		// countChart.render();
		// curriculum.render();
		// speech_text.render();
    } else if(flag ==1 ){
    	actuals.gap(5);
		curriculum.render();
		dc.redrawAll();
    }else {
		dc.redrawAll();
	}
	setTimeout(function(){
		$('.loader2').toggle('custom-display-show')
	 	$('.container-fluid').toggleClass('custom-visibility-hide');
	},500);	
}

function hideSelectAll(){
	 	$( "li:contains('All selected')" ).css( "display", "none" );
	 }

	function filterAllDownwords(startpoint){
		for(var counter=startpoint;counter<=3;counter++){
			var eleid=allfilters[counter];
			//$('#'+eleid+' select').multipleSelect('disable'); 
			$('#'+eleid+' select').multipleSelect('uncheckAll'); 
			//$('#'+eleid+' select').multipleSelect('refresh');
			//flag=true;
		}
		 //alert('n12')
	}


	
/*window.onresize = function(event) {  	 
		var newWidth = document.getElementById('project').offsetWidth;
		regionChart.width(newWidth)
		    .transitionDuration(0);
				   
		 
		
		var newheight = document.getElementById('project').offsetHeight;
		
		
		var newWidth = document.getElementById('curriculum-quality').offsetWidth;
		 curriculum.width(newWidth)
		    .transitionDuration(0);
			
		// var newWidth = document.getElementById('instuctor-question').offsetWidth;
		 // questionChart.width(newWidth)
		    // .transitionDuration(0);
			
		
		// Utility.accordianfn();
		 $('.sidebar-nav').addClass('collapse'); 
		 curriculum.render();
		 dc.redrawAll();	
		
}; */


$(".dc-data-count a").on("click",function(){
	$('#curriculum-chart select').multipleSelect('uncheckAll');
})