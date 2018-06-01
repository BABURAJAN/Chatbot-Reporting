// global variable for capturing the current ajax request.
var currentRequest = null;
var currentFilterRequest = null; // this variable will capture the ajax request for filters 



Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}

Array.prototype.sortObject = function(key) {	
	var array = this.sort(function(a,b) {return (a[key] < b[key]) ? 1 : ((b[key] < a[key]) ? -1 : 0);} );
	return array;
}


// global variable for capturing the current ajax request.
//var currentRequest = null;
//var currentFilterRequest = null; // this variable will capture the ajax request for filters 

/*
Array.protoype.uniqueObj=function(originalArray, objKey)
{
	var trimmedArray = []; 
	  var values = []; 
	  var value;  

	  for(var i = 0; i < originalArray.length; i++) {
	    value = originalArray[i][objKey]; 

	    if(values.indexOf(value) === -1) { 
	      trimmedArray.push(originalArray[i]); 
	      values.push(value); 
	    } 
	  } 

	  return trimmedArray; 
} */






convertObjToArray = function(data){
	var arr = []		
	for(var prop in data){			    
	    arr.push(data[prop]);
	}
	return arr;
}

 
function singleSelectionWithCheckbox(e, cSelected, id){
		  var a;
          if(e.target.value != cSelected){
                 a = $('#'+id+' option:selected')[0].value;
                 cSelected = $('#'+id+' option:selected')[0].value;                                      
          }else{
                 a = $('#'+id+' option:selected')[1].value; 
                 cSelected = $('#'+id+' option:selected')[1].value;      
          }
          
          $('#'+id).multiselect("clearSelection");
          $('#'+id).multiselect("deselectAll")
          $('#'+id).multiselect("select", [a])
          
          return cSelected;
}

Utility = new function(){
	
	this.month = [	"January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];	
	var quater = [	"Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec" ]
	
	
	this.mData = [	{"label":"January","value":"January"}, 
		{"label":"Feburary","value":"Feburary"},
		{"label":"March","value":"March"},
		{"label":"April","value":"April"},
		{"label":"May","value":"May"},
		{"label":"June","value":"June"},
		{"label":"July","value":"July"},
		{"label":"August","value":"August"},
		{"label":"September","value":"September"},
		{"label":"October","value":"October"},
		{"label":"November","value":"November"},
		{"label":"December","value":"December"}];	
	
	
	this.qData = [	{"label":"Jan-Mar","value":"Jan-Mar"}, 
		{"label":"Apr-Jun","value":"Apr-Jun"},
		{"label":"Jul-Sep","value":"Jul-Sep"},
		{"label":"Oct-Dec","value":"Oct-Dec"}];	
	
	this.yData = [	{"label":"2017","value":"2017"}];		
	
	
	
	
	
	this.getMonthFromString = function(mon){

	   var d = Date.parse(mon + "1, 2012");
	   if(!isNaN(d)){
	      return new Date(d).getMonth() + 1;
	   }
	   return -1;
	}
	
	this.getQuaterFromString= function(quat){
		for(var i=0; i<quater.length; i++){
			if(quat == quater[i]){
				return (i+1);
			}
		}
	}
	
	this.alertMsg = function(msg){
		$("#myModalAlert").modal("show");
		$('#myModalAlert p').text(msg);  
	}
	
	
	
	this.ajaxCall = function(url, data, callback){
	
		currentRequest = $.ajax({
			  type: "POST", 
			  url: "/"+url,
			  data: data,
			  dataType: "json",
			  beforeSend : function() {
			  	
			   	if (currentRequest != null) {
		      		currentRequest.abort();
				}
			//	$('.loader').css({"display": "block"});
				//console.log("@TODO add loader");
			  },
			  success: function(response) {			  	
				console.log("response: "+response);
				callback(response);
			  },
			  error: function(xhr, ajaxOptions, thrownError) { 
				console.log("@TODO gracefully show error" + thrownError);
			  },complete:function(){
			//  	$('.loader').css({"display": "none"});
			//	console.log("@TODO remove loader");
			  }
		});
	}

	barCount = 20;
	
	
	
	this.pagination = function(data, id, fn, firstTime){ 
		var pageCount = Math.ceil(data.length / barCount);
	
		if(pageCount == 0){
			pageCount = 1;					
		}
		
		
		$('#'+id).parent().siblings('.pagin').twbsPagination('destroy');
		
		$('#'+id).parent().siblings('.pagin').twbsPagination({
			totalPages: pageCount,
			visiblePages: "5",
			onPageClick: function (event, page) {			
				fn(page);	
				
				if(firstTime){
					firstTime = false;
				}else{					
					dc.redrawAll();	
				}
		$('#'+id).parent().siblings('.recordsInfo').text('Showing '+(page*barCount+1-barCount)+' to '+(((page*barCount)>data.length)?data.length:(page*barCount))+' of total '+data.length); 
				
			}
		});
				
}


	this.accordianfn = function()
	{
		//$('.smaccordion').siblings('.panel-body').css({'display':'block'})
		
		var acc = document.getElementsByClassName("smaccordion");
		var i;
		for (i = 0; i < acc.length; i++) {
			acc[i].classList.toggle("active");
			var panel = acc[i].nextElementSibling;   
			if (panel.style.maxHeight){
				panel.style.display='none';
				panel.style.maxHeight = null;				  
				$("#dc-legend").css("display","none");
			} else {
				panel.style.display='block';
				panel.style.maxHeight = panel.scrollHeight + "px";				  
				$("#dc-legend").css("display","block");
			} 		
			acc[i].onclick = function() {
				this.classList.toggle("active");
				var panel = this.nextElementSibling;
				
				if (panel.style.maxHeight){
					$(this).siblings('.panel-body').css({'display':'none'}) 
					panel.style.maxHeight = null;
					if($(this).parent().attr('id') == "nps-row-custom-legend"){
						$("#dc-legend").css("display","none");
					}		
					$(".smpanel").removeClass("allowSafari");					  			
				} else {
					$(this).siblings('.panel-body').css({'display':'block'})	
					if($(this).parent().attr('id') == "nps-row-custom-legend"){
						$("#dc-legend").css("display","block");
					}		
					panel.style.maxHeight = panel.scrollHeight + "px";	
					$(".smpanel").addClass("allowSafari");					  				
				} 										
		}
	}
 }	
	
}

function tooltip(_chart,id){
	  _chart.selectAll("rect").on("click", function(e){
			$('.tooltip').remove();
			$(id).append('<span class="tooltip">'+e.key1 +'<br/>'+(parseFloat(parseFloat(e.value).toFixed(0))).toLocaleString()+'</span>');
			
			var left = '50px';
			var top = ($(this).position().top - 1630);
			console.log(left)
            if(/android|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())){
                    top = (top-$(id).offset().top)+50;
            }
			$('.tooltip').css('left',left);
			$('.tooltip').css('top',top);	
			$('.tooltip').animate({opacity: 0.9},{duration: 100, complete: function(){
				$(this).fadeOut(5000);
			}});
		  });
		  _chart.selectAll("rect ~ text").on("click", function(e){
			$('.tooltip').remove();
			$(id).append('<span class="tooltip">'+e.key1 +'<br/>'+(parseFloat(parseFloat(e.value).toFixed(0))).toLocaleString()+'</span>');
			
			var left = '50px';
			var top = ($(this).position().top - 1650);
			console.log(left)
            if(/android|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())){
                    top = (top-$(id).offset().top)+50;
            }
			console.log(left)
			console.log(top)
			$('.tooltip').css('left',left);
			$('.tooltip').css('top',top);	
			$('.tooltip').animate({opacity: 0.9},{duration: 100, complete: function(){
				$(this).fadeOut(5000);
			}});
		  });
		  	  _chart.selectAll("path").on("click", function(e){
			$('.tooltip').remove();
			$(id).append('<span class="tooltip">'+e.data.key1 +'<br/>'+(parseFloat(parseFloat(e.value).toFixed(0))).toLocaleString()+'</span>');
			
			var left = '130px';
			var top = ($(this).position().top + 60)+'px';
			console.log(left)
			console.log(top)
			$('.tooltip').css('left',left);
			$('.tooltip').css('top',top);	
			$('.tooltip').animate({opacity: 0.9},{duration: 100, complete: function(){
				$(this).fadeOut(5000);
			}});
		  });
		  _chart.selectAll("text.pie-slice").on("click", function(e){
			$('.tooltip').remove();
			$(id).append('<span class="tooltip">'+e.data.key1 +'<br/>'+(parseFloat(parseFloat(e.value).toFixed(0))).toLocaleString()+'</span>');
			
			var left = '125px';
			var top = ($(this).position().top + 20)+'px';
			console.log(left)
			console.log(top)
			$('.tooltip').css('left',left);
			$('.tooltip').css('top',top);	
			$('.tooltip').animate({opacity: 0.9},{duration: 100, complete: function(){
				$(this).fadeOut(5000);
			}});
		  });
}

function tooltipforVendors(_chart,id,field){
	  _chart.selectAll("rect").on("click", function(e){
			$('.tooltip').remove();
			if(field != undefined){
				$(id).append('<span class="tooltip">'+e.key1 +'<br/>'+(parseFloat(parseFloat(e.value[field]).toFixed(0))).toLocaleString()+'</span>');
			}
			else{
				$(id).append('<span class="tooltip">'+e.key1 +'<br/>'+(parseFloat(parseFloat(e.value).toFixed(0))).toLocaleString()+'</span>');
			}
			var left = '50px';
			var top = ($(this).position().top + 20);
            console.log(left)
            if(/android|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())){
                    top = (top-$(id).offset().top)+50;
            }
			$('.tooltip').css('left',left);
			$('.tooltip').css('top',top);	
			$('.tooltip').animate({opacity: 0.9},{duration: 100, complete: function(){
				$(this).fadeOut(5000);
			}});
		  });
		  _chart.selectAll("text").on("click", function(e){
			$('.tooltip').remove();
			if(field != undefined){
				$(id).append('<span class="tooltip">'+e.key1 +'<br/>'+(parseFloat(parseFloat(e.value[field]).toFixed(0))).toLocaleString()+'</span>');
			}
			else{
				$(id).append('<span class="tooltip">'+e.key1 +'<br/>'+(parseFloat(parseFloat(e.value).toFixed(0))).toLocaleString()+'</span>');
			}			
			var left = '50px';
			var top = ($(this).position().top + 20);
            console.log(left)
            if(/android|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())){
                    top = (top-$(id).offset().top)+50;
            }
			$('.tooltip').css('left',left);
			$('.tooltip').css('top',top);	
			$('.tooltip').animate({opacity: 0.9},{duration: 100, complete: function(){
				$(this).fadeOut(5000);
			}});
		  });
}

/*for the side war scroll based on the class ".left" */
function checkforScroll(){
	var getSideBarWidth = $(".left.filterPanel").width();
    var $window = $(window);
	if($window.width()>700){
    var lastScrollTop = $window.scrollTop();
    var wasScrollingDown = true;

    var $sidebar = $(".left");
    if ($sidebar.length > 0) {

        var initialSidebarTop = $sidebar.position().top;

        $window.scroll(function(event) {

            var windowHeight = $window.height();
            var sidebarHeight = $sidebar.outerHeight();
			var sidebarWidth = $sidebar.outerWidth();
			
            var scrollTop = $window.scrollTop();			
            var scrollBottom = scrollTop + windowHeight;

            var sidebarTop = $sidebar.position().top;
            var sidebarBottom = sidebarTop + sidebarHeight;

            var heightDelta = Math.abs(windowHeight - sidebarHeight);
            var scrollDelta = lastScrollTop - scrollTop;

            var isScrollingDown = (scrollTop > lastScrollTop);
            var isWindowLarger = (windowHeight > sidebarHeight);

            //if ((isWindowLarger && scrollTop > initialSidebarTop) || (!isWindowLarger && scrollTop > initialSidebarTop + heightDelta)) {
			if(scrollTop > 60){
				$sidebar.css('width', getSideBarWidth+'px');
				$sidebar.addClass('fixed');
				$("body").addClass("custom-scroll");
            //} else if (!isScrollingDown && scrollTop <= initialSidebarTop) {
			}else {
                $sidebar.removeClass('fixed');
				$("body").removeClass("custom-scroll");
            }

            var dragBottomDown = (sidebarBottom <= scrollBottom && isScrollingDown);
            var dragTopUp = (sidebarTop >= scrollTop && !isScrollingDown);

            if (dragBottomDown) {
                if (isWindowLarger) {
                    $sidebar.css('top', '70px');
                } else {
                    //$sidebar.css('top', -heightDelta);
					$sidebar.css('top', '70px');
                }
            } else if (dragTopUp) {
                $sidebar.css('top', '70px');
            } else if ($sidebar.hasClass('fixed')) {
                var currentTop = parseInt($sidebar.css('top'), 8);

				
                var minTop = -heightDelta;
                var scrolledTop = currentTop + scrollDelta;
                
                var isPageAtBottom = (scrollTop + windowHeight >= $(document).height());
                var newTop = (isPageAtBottom) ? minTop : scrolledTop;
                
                //$sidebar.css('top', newTop);
				$sidebar.css('top', '70px');
            }

            lastScrollTop = scrollTop;
            wasScrollingDown = isScrollingDown;
        });
    }
	}
}
/*for the side war scroll */

//Remove extra zeros after decimal and count as single zero

function snap_to_zero(source_group) {
	return {		
		all:function () {
			return source_group.all().map(function(d) {
			return {key: d.key, key1 : d.key,
			value: (Math.abs(d.value)<1e-6) ? 0 : d.value};
			});
		},
	};
}


// sb-admin-2 js
$(function() {

    $('#side-menu').metisMenu();

});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    $(window).bind("load resize", function() {
        topOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    var element = $('ul.nav a').filter(function() {
        return this.href == url || url.href.indexOf(this.href) == 0;
    }).addClass('active').parent().parent().addClass('in').parent();
    if (element.is('li')) {
        element.addClass('active');
    }
});

// End of sb-admin-2 js


// scroll addClass

/*$(window).scroll(function() {
    var scroll = $(window).scrollTop();
    if (scroll >= 40) {
        $("#wrapper").addClass("custom-scroll");
		$('.left.filterPanel').find('.col-lg-12').addClass('col-lg-6').removeClass('col-lg-12');
		$('.left.filterPanel').css('width','572px');
		$('.right.graphPanel').css('width','calc(100% - 574px)');
		$('.funFilters').css('margin-top','22px');

		
    }else if(scroll <= 40) {
		$("#wrapper").removeClass("custom-scroll");
		$('.left.filterPanel').find('.col-lg-6').addClass('col-lg-12').removeClass('col-lg-6');
		$('.left.filterPanel').css('width','286px');
		$('.right.graphPanel').css('width','69.5%');
		$('.funFilters').css('margin-top','-1px');
	}
});

$('.navbar-toggle').click(function(){
	$('.custom-scroll .sidebar').toggleClass('active');
})*/

function remove_empty_bins(source_group) {  
	  return {       
		   all:function () {          
			  return source_group.all().filter(function(d) { 				  
				          if(d.value.events != 0) return d.value ;         
				});      
		}  
	};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* on date selection */            
 function getDateRangeData(dateurl,start, end, label) {
	
                    $('.container-fluid').addClass('custom-visibility-hide');
                    $('.loader2').toggle('custom-display-show');
                    $.ajax({
                       
						url: dateurl,
                        dataType: 'JSON',
                        type: "POST",
                        data: JSON.stringify({
                            startDate: Date.parse(start.format("MM-DD-YYYY")),
                            endDate: Date.parse(end.format("MM-DD-YYYY"))
                        }),
                        contentType: "application/json; charset=utf-8",
                        success: function(data) {
                            if (data.message.data != "[]" && data.message.data != undefined) {
                                drawGraph(data.message.data, 1);
								console.log("::data.startDate::::::::::::::"+data.startDate);
								console.log("::data.endDate::::::::::::::"+data.endDate);

                            }
                        }
                    });
					console.log("==MM/DD/YYYY========================="+Date.parse(start.format("MM/DD/YYYY")));
					console.log("--MM/DD/YYYY-------------------------"+Date.parse(end.format("MM/DD/YYYY")));
					console.log("==DD-MM-YYYY========================="+Date.parse(start.format("MM-DD-YYYY")));
					console.log("--DD-MM-YYYY-------------------------"+Date.parse(end.format("MM-DD-YYYY")));
                }
				
		
				


/*method to get overall accuracy of sentiment Analysis*/
function getAccuracy() {

    $.ajax({
        url: "/accuracy",
        dataType: 'JSON',
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            var x = data.message.data[0].acc;
            $(".txt1").text(x + "%");
        }
    });
}


/*method to get redhat data by using AJAX call and draw graph*/
function getRedhatData(redhaturl, compId, sdropdown) {
   

    $.ajax({
        url: redhaturl,

        dataType: 'JSON',
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function(data) {

	        //  TO Draw graph	
            drawGraph(data.message.data, 0);
			
             // for expand collapse of tab 
            Utility.accordianfn();

			if(redhaturl == '/redhat/qualityvtsupport'){
				$(".ms-drop > ul > li:first").css('display', 'none');
				
			}else{
			

            $(".ms-drop > ul > li:nth-child(2)").css('display', 'none');
            $('.ms-choice > span').siblings().addClass('caret');
            $('.ms-choice > span').text("All Selected");
            $('ul > li > label > input').prop("checked", true);
            $(compId + " svg").css('margin-left', '20px');
			
			
			
			// To draw sentiment dropdown
			
			if(redhaturl == '/redhat/qualitycurriculum' || redhaturl == '/redhat/qualityfacility' || redhaturl == '/redhat/qualityinstructor'){
			drwSntmntDrpDwn(sdropdown);
			
			// to show accuracy 
			var x = data.message.acc[0].acc;
            $(".txt1").text(x + "%");
			}
			}
			


           /* for sentiment Analysis feedback */
		   
            if (redhaturl == '/redhat/qualitycurriculum') {
                
                var arr = _.groupBy(data.message.data, 'cc')
                sfeedbacks(arr);
				
            } else if (redhaturl == '/redhat/qualityfacility') {
               
                var arr = _.groupBy(data.message.data, 'fy')
                sfeedbacks(arr);
				
            } else if (redhaturl == '/redhat/qualityinstructor') {

                
                var arr = _.groupBy(data.message.data, 'rhid')
                sfeedbacks(arr);
            }



        }
    });
}




/*method to get redhat data by using AJAX call and draw graph*/
function getPicasiData(redhaturl, compId, sdropdown) {
   

    $.ajax({
        url: redhaturl,

        dataType: 'JSON',
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function(data) {

	        //  TO Draw graph	
            drawGraph(data.message.data, 0);
			
            // for expand collapse of tab 
            Utility.accordianfn();

			
        }
    });
}



/*method to draw sentiment drop down */
function drwSntmntDrpDwn(sdropdown){

	
	
		var nonst = 'Select Filter',
			nst= 'Filters';
			switch(sdropdown){
				case '#cucdropdown': 
				
				nonst = 'Select Curriculum';
				nst = 'Curriculums';
				break;
				
				case '#fcdropdown':
				
				nonst = 'Select Facilities';
				nst = 'Facilities';
				break;
				
				case '#insdropdown':
				
				nonst = 'Select Instructor';
				nst = 'Instructors';
				break;
				
			}

            $(sdropdown).multiselect({
                includeSelectAllOption: true,
                enableFiltering: true,
                enableCaseInsensitiveFiltering: true,
                disableIfEmpty: false,
                selectAllText: 'Select All',
                selectAllName: 'BU-all',
                allSelectedText: 'All Selected',
                nonSelectedText: nonst,
                nSelectedText: nst,
                maxHeight: 350,
                numberDisplayed: 1,
                disableIfEmpty: false,

                onChange: updateCount
            });

}

/**
 * Function to sum all groups count to find percentage
 * @param1  groupObj  All Group custom data 
 * @param1  sumColumn  column in custom group whose values needed to  be
 * @author  Shubham Jolly
 *
 * response totalCount integer value
 */

var getTotalGroupItemsSum = function(groupObj, sumColumn){
    var totalCount = 0;
    groupObj.forEach(function(element) {        
        totalCount += Number(element.value[sumColumn]);   
    });
    return totalCount;
}