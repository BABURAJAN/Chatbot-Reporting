//# dc.js Getting Started and How-To Guide
'use strict';
var ndx;
/* jshint globalstrict: true */
/* global dc,d3,crossfilter,colorbrewer */

// ### Create Chart Objects

// Create chart objects associated with the container elements identified by the css selector.
// Note: It is often a good idea to have these objects accessible at the global scope so that they can be modified or
// filtered by other page controls.
var regionChart = dc.rowChart("#region-chart");
var countChart = dc.rowChart("#count_chart");

var questionChart = dc.rowChart("#instuctor-question");

var start, end;
var totalcount = 1;
var redrawflag = false;
var flag=false;

var curriculum = dc.compositeChart("#curriculum-quality");

/*var getWeekNumber = function(weekdata){
	var weeksTRING =weekdata.split('-')[0];
	return weeksTRING.split(' ')[1];	
}*/
function drawGraph(data, flag) {
   
    ndx = crossfilter(data)
	var all = ndx.groupAll();

    var regionDim = ndx.dimension(function(d) {
        return d.rgn;
    });
    var regionGroup = regionDim.group();
	
	var countDim = ndx.dimension(function(d) {
		            var now = new Date(d.ed);
					return d3.time.format('%d %b %Y')(now);
		
    });
    ///var countGroup = countDim.group();
	 var countGroup = countDim.group()
        .reduceSum(function(d) {
            var rett = d.ns === null ? 0 : d.ns;
            return rett;
        });
	
	
    regionChart
       // .width(280)
        //.height(180)
        .dimension(regionDim)
        .group(regionGroup)
		.title(function (d) {
			return d.key + ' : '+ d.value + ",\nPercentage : "+(d.value / all.value() * 100).toFixed(2);
		})
	
   countChart 
     .height(450)
   .dimension(countDim)
        .group(countGroup)
		.title(function (d) {
			return d.value;
		})
    


	
	

	
		
    var rsrctype = ndx.dimension(function(d) {
		var now = new Date(d.ed);
					return d3.time.format('%d %b %Y')(now);
        //return d.wyr;
    });
	
    var rsrcGroup1 = rsrctype.group().reduce(
        /* callback for when data is added to the current filter results */
        function(p, v) {

           // ++p.count;
			p.events += v.ien;
            p.in_score += (v.cus == null ? 0 : v.cus);
            if (p.events != 0 && p.events != null) {
                p.avg_score = (p.in_score / p.events).toFixed(2);
            }
           
            return p;
        },
        /* callback for when data is removed from the current filter results */
        function(p, v) {

            //--p.count;
			p.events -= v.ien;
            p.in_score -= (v.cus == null ? 0 : v.cus);
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
		.group(remove_empty_bins(rsrcGroup1), "Average Of Curriculum", sel_stack1(1))
        .colors('#6baed6')
		//.barPadding(0)
		//.outerPadding(2)
                
    var budgets = dc.lineChart(curriculum)

        .dimension(rsrctype)
        .group(remove_empty_bins(rsrcGroup1), "No. of Interactions", sel_stack(1))
        .useRightYAxis(true)
        .colors('#ff7f0e')
        .renderDataPoints(true)
        .renderTitle(true)

		var budgets1 = dc.lineChart(curriculum)	
		.group(remove_empty_bins(rsrcGroup1), "Curriculum Target : 4", sel_stack2(1))
		//.useRightYAxis(true)
		.colors('green')
		.renderDataPoints(true)		               
		.renderTitle(true)
		//.renderLabel(true)

    curriculum
      //  .width(850)
        .height(600)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .margins({
			top: 100,
			right: 60,
			bottom: 100,	
			left: 50
        })
        .brushOn(false)
        ._rangeBandPadding(1)
        .elasticY(true)
		.elasticX(true)
         .yAxisLabel("Average Of Curriculum")
         .xAxisLabel("Weeks")
        .rightYAxisLabel("No. of Interactions")

        .dimension(rsrctype)
        .group(remove_empty_bins(rsrcGroup1), "No. of Interactions", sel_stack(1))
        .legend(dc.legend().x(550).y(20).itemHeight(13).gap(5))
        .shareTitle(false)
        .renderTitle(true)
        .compose([ budgets])
		
		function regroup(dim, cols) {
			var avg=[], favg = {};
			var _groupAll = dim.groupAll().reduce(
				function(p, v) { // add				
					cols.forEach(function(c) {
						if(p.arr.hasOwnProperty(v[c]["insq"])){
							p.arr[v[c]["insq"]] = Number(p.arr[v[c]["insq"]]) + v[c]["sc"];
							//avg[v[c]["insq"]] = avg[v[c]["insq"]] + 1;
							if(c=='cm_q1') ++p.p1;
							if(c=='cm_q2') ++p.p2;
							if(c=='cm_q3') ++p.p3;
							if(c=='cm_q4') ++p.p4;
							//if(c=='ist_q5') --p.p5;
						}
						else{
							var count=0;
							p.arr[v[c]["insq"]] = "";							
							++count;
							p.arr[v[c]["insq"]] = Number(p.arr[v[c]["insq"]]) + v[c]["sc"];
							//avg[v[c]["insq"]] = count;
							if(c=='cm_q1') ++p.p1;
							if(c=='cm_q2') ++p.p2;
							if(c=='cm_q3') ++p.p3;
							if(c=='cm_q4') ++p.p4;
							//if(c=='ist_q5') --p.p5;
						}
						//favg[v[c]["insq"]] =  p[v[c]["insq"]] / avg[v[c]["insq"]];
						if(!favg.hasOwnProperty(v[c]["insq"])){
							p.favg[v[c]["insq"]] = 0;
						}
						if(c=='cm_q1')	p.favg[v[c]["insq"]] = (p.arr[v[c]["insq"]] / p.p1);
						if(c=='cm_q2')	p.favg[v[c]["insq"]] = (p.arr[v[c]["insq"]] / p.p2);
						if(c=='cm_q3')	p.favg[v[c]["insq"]] = (p.arr[v[c]["insq"]] / p.p3);
						if(c=='cm_q4')	p.favg[v[c]["insq"]] = (p.arr[v[c]["insq"]] / p.p4);
						//if(c=='cm_q1')	p.favg[v[c]["insq"]] = (p.arr[v[c]["insq"]] / p.p5);
						
					});
					//Object.keys(p.arr).forEach(function(c) {
					//	favg[c] = favg[c] + (p[c] / 5);
					//})
					return p;
				},
				function(p, v) { // remove
						cols.forEach(function(c) {
						if(p.arr.hasOwnProperty(v[c]["insq"])){
							p.arr[v[c]["insq"]] = Number(p.arr[v[c]["insq"]]) - v[c]["sc"];
							//avg[v[c]["insq"]] = avg[v[c]["insq"]] + 1;
							if(c=='cm_q1') --p.p1;
							if(c=='cm_q2') --p.p2;
							if(c=='cm_q3') --p.p3;
							if(c=='cm_q4') --p.p4;
							//if(c=='ist_q5') --p.p5;
						}
						else{
							var count=0;
							p.arr[v[c]["insq"]] = "";							
							++count;
							p.arr[v[c]["insq"]] = Number(p.arr[v[c]["insq"]]) - v[c]["sc"];
							//avg[v[c]["insq"]] = count;
							if(c=='cm_q1') --p.p1;
							if(c=='cm_q2') --p.p2;
							if(c=='cm_q3') --p.p3;
							if(c=='cm_q4') --p.p4;
							//if(c=='ist_q5') --p.p5;
						}
						//favg[v[c]["insq"]] =  p[v[c]["insq"]] / avg[v[c]["insq"]];
						if(!favg.hasOwnProperty(v[c]["insq"])){
							p.favg[v[c]["insq"]] = 0;
						}
						if(c=='cm_q1')	p.favg[v[c]["insq"]] = (p.arr[v[c]["insq"]] / p.p1);
						if(c=='cm_q2')	p.favg[v[c]["insq"]] = (p.arr[v[c]["insq"]] / p.p2);
						if(c=='cm_q3')	p.favg[v[c]["insq"]] = (p.arr[v[c]["insq"]] / p.p3);
						if(c=='cm_q4')	p.favg[v[c]["insq"]] = (p.arr[v[c]["insq"]] / p.p4);
						//if(c=='ist_q5')	p.favg[v[c]["insq"]] = (p.arr[v[c]["insq"]] / p.p5);
						
					});
					//Object.keys(p.arr).forEach(function(c) {
					//	favg[c] = favg[c] + (p[c] / 5);
					//})
					return p;
				},
				function() { // init
				return { 
					p1:0,
					p2:0,
					p3:0,
					p4:0,
				//	p5:0,
					arr : {}, favg : {}
				}					
					// cols.forEach(function(c) {
						// p = {};						
					// });
					//return p;
				});
			return {
				all: function() {
					// or _.pairs, anything to turn the object into an array
					return d3.map(_groupAll.value().favg).entries();
				}
			};
		}
		// it doesn't really matter what you index the dimension on,
		// because you won't be able to filter on this dimension
		// we just need something to call .groupAll on.
		var dim = ndx.dimension(function(r) { return r.cm_q1; });
		var sidewaysGroup = regroup(dim, ['cm_q1', 'cm_q2', 'cm_q3','cm_q4']);
		
		// var dim = ndx.dimension(function(r) { return r.ofd});
		// var sidewaysGroup = dim.group().reduceSum(function(d) { 
			// return+d.ist_q1.sc; 
		// })
		questionChart			
			.height(300)
			.data(function(group){
				var items = group.all();
				for(var i=0; i < items.length; i++){
				   if($(window).width() <= 900){
					   items[i].key = items[i].key.substring(0, 10) + '...';
				   }
				}
				return items;
			})
			.dimension(dim)
			.group(snap_to_zero(sidewaysGroup))
			.elasticX(true)
			.ordinalColors(["#3182bd"])
			.renderTitleLabel(true)
			.title(function(d){
				return (d.value).toFixed(2);
			})
			.render();
        
	questionChart.filter = function(){};
	 if($(window).width() <= 900){
	   questionChart.on('renderlet',function(_chart){
			tooltip(_chart,'#instuctor-question');
		})
	}   
	
    if (flag == 0) {
		actuals.gap(5);
        dc.renderAll();
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


	
window.onresize = function(event) {  	 
		var newWidth = document.getElementById('region-chart').offsetWidth;
		regionChart.width(newWidth)
		    .transitionDuration(0);
				   
		 
		
		var newheight = document.getElementById('region-chart').offsetHeight;
		
		
		var newWidth = document.getElementById('curriculum-quality').offsetWidth;
		 curriculum.width(newWidth)
		    .transitionDuration(0);
			
		var newWidth = document.getElementById('instuctor-question').offsetWidth;
		 questionChart.width(newWidth)
		    .transitionDuration(0);
			
		
		// Utility.accordianfn();
		 $('.sidebar-nav').addClass('collapse'); 
		 curriculum.render();
		 dc.redrawAll();	
		
};


$(".dc-data-count a").on("click",function(){
	$('#curriculum-chart select').multipleSelect('uncheckAll');
})