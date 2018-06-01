Graph = new function(){
	
	this.backgroundColorA = [
		'rgba(255, 99, 132, 0.2)',
		'rgba(54, 162, 235, 0.2)',
		'rgba(255, 206, 86, 0.2)',
		'rgba(75, 192, 192, 0.2)',
		'rgba(153, 102, 255, 0.2)',
		'rgba(255, 159, 64, 0.2)',
		'rgba(255, 99, 132, 0.2)',
		'rgba(54, 162, 235, 0.2)',
		'rgba(255, 206, 86, 0.2)',
		'rgba(75, 192, 192, 0.2)'		
	];
	
	this.borderColorA = [
		'rgba(255,99,132,1)',
		'rgba(54, 162, 235, 1)',
		'rgba(255, 206, 86, 1)',
		'rgba(75, 192, 192, 1)',
		'rgba(153, 102, 255, 1)',
		'rgba(255, 159, 64, 1)',
		'rgba(255,99,132,1)',
		'rgba(54, 162, 235, 1)',
		'rgba(255, 206, 86, 1)',
		'rgba(75, 192, 192, 1)'
	];

	
	this.renderGraph = function(gProperty, idSelector){
		var type = 			(gProperty.type == undefined) ? 'bar' :  gProperty.type;
		var isStack = 		(gProperty.isStack == undefined) ? false :  gProperty.isStack;
		var lposition = 	(gProperty.lposition == undefined) ? 'top' :  gProperty.lposition;
		var showlegend = 	(gProperty.showlegend == undefined) ? true :  gProperty.showlegend;
		var showXaxis = 	(gProperty.showXaxis == undefined) ? true :  gProperty.showXaxis;	
		var showYaxis = 	(gProperty.showYaxis == undefined) ? true :  gProperty.showYaxis;	
		var xLabel =		(gProperty.xLabel == undefined)? '' : gProperty.xLabel;
		var yLabel =		(gProperty.yLabel == undefined)? '' : gProperty.yLabel;	
		var yLabelRight =	(gProperty.yLabelRight == undefined)? '' : gProperty.yLabelRight;			
		var data = 			(gProperty.data == undefined)? '' : gProperty.data; 		
		var showLabels = 	(gProperty.showLabels == undefined)? '' : gProperty.showLabels; 
		
		
		$(idSelector).empty();			
		$(idSelector).append("<canvas></canvas>");
			
		var ctx =  document.getElementById(idSelector.substring(1)).getElementsByTagName("canvas")[0].getContext("2d")
	
		
		if(gProperty.type == 'horizontalBar'){
			
			// condition for IE
			var computedHeight
			var newposition;
		    var ua = window.navigator.userAgent;
		    var msie = ua.indexOf("MSIE ");

		    /*if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
		    {
		    	computedHeight = Number(data.datasets[0].data.length) * 25;
				newposition=1;
		    }
			else if (screen && screen.width < 500) {
				computedHeight = Number(data.datasets[0].data.length) * 5;
			}
		    else  // If another browser, return 0
		    {
		    	 computedHeight = Number(data.datasets[0].data.length) * 50;
				 newposition=5;
		    }*/
			
		    	computedHeight = Number(data.datasets[0].data.length) * 40;
				computedHeight = computedHeight > 445 ? computedHeight : 445;
				$(idSelector).css({'height': computedHeight + "px" });
				
			GraphObj ={
				type: gProperty.type,
				data: data,
				options: {
					responsive: true,
					maintainAspectRatio: false,
					legend: {
						display: showlegend,
						position: lposition
					},
					scales: {
					    yAxes: [{
					    	stacked:isStack,
					    	ticks: {
				                beginAtZero: true
				            },
					    	scaleLabel: {
					        display: showYaxis,
					        labelString: yLabel
					      }
					    }],
					    xAxes: [{
					    	stacked:isStack, 
					    	ticks: {
				                beginAtZero: true,
								//max : 120
				            },
					    	scaleLabel: {
						        display: showXaxis,
						        labelString: xLabel
						      }
						    }]
						    
					  }
				}
			}
			if(showLabels){				
				GraphObj.options.animation = {
					duration: 1,
					onComplete: function () {
						var chartInstance = this.chart;
						var ctx = chartInstance.ctx;
						ctx.textAlign = "center";
	
						Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
							var isHidden = dataset._meta[Object.keys(dataset._meta)[0]].hidden;
							if (isHidden == null || isHidden == undefined || !isHidden) {
								var meta = chartInstance.controller.getDatasetMeta(i);
								Chart.helpers.each(meta.data.forEach(function (bar, index) {
							
								//added black color on rollover	
								var gradient=ctx.createLinearGradient(0,0,100,0);									
								gradient.addColorStop("1.0","#000");									
								ctx.fillStyle=gradient;
								if(dataset.data[index] != 0){
									ctx.fillText(dataset.data[index], bar._model.x - 10, bar._model.y - 5);
								}
								else{
									ctx.fillText(dataset.data[index], bar._model.x + 10, bar._model.y - 5);
								}
							}),this)
							}
						}),this);
					}
				}
			}
			window.myHorizontalBar = new Chart(ctx, GraphObj);
			
		}
		else if(gProperty.type == 'pie'){
			window.myBar = new Chart(ctx, {
				type: 'pie',
				data: data,
			});
		}else if(gProperty.type == 'doughnut'){
			window.myBar = new Chart(ctx, {
				type: 'doughnut',
				data: data,
			});
		}else{
			GraphObj = {
				type: type,
				data: data,
				options: {
					responsive: true,
					legend: {
						display: showlegend,
						position: lposition
					},
					scales: {
					   yAxes: [{
					    	stacked:isStack,
					    	ticks: {
				                beginAtZero: true
				            },
					    	scaleLabel: {
					        display: showYaxis,
							 
					        labelString: yLabel
					      },
						  position: "left",
						  id: 'A'
					    },
						{
					    	stacked:isStack,
					    	ticks: {
				                beginAtZero: true
				            },
					    	scaleLabel: {
					        display: showYaxis,
							 
					        labelString: yLabelRight
					      },
						  position: "right",
						  id: 'B'
					    }],
					    xAxes: [{
					    	stacked:isStack,  
					    	scaleLabel: {
						        display: showXaxis,
						        labelString: xLabel
						      },
							  ticks: {									
									autoSkip: false
								}
						    }]						    
					  	}
					}
			}
			
			
			if(showLabels){
				
				GraphObj.options.animation = {
					duration: 1,
					onComplete: function () {
						var chartInstance = this.chart;
						var ctx = chartInstance.ctx;
						ctx.textAlign = "center";
	
						Chart.helpers.each(this.data.datasets.forEach(function (dataset, i) {
							var isHidden = dataset._meta[Object.keys(dataset._meta)[0]].hidden;
							if (isHidden == null || isHidden == undefined || !isHidden) {
								var meta = chartInstance.controller.getDatasetMeta(i);
								Chart.helpers.each(meta.data.forEach(function (bar, index) {
							
								//added black color on rollover	
								var gradient=ctx.createLinearGradient(0,0,100,0);									
								gradient.addColorStop("1.0","#000");									
								ctx.fillStyle=gradient;							
								ctx.fillText(dataset.data[index], bar._model.x, bar._model.y +10);
								
							}),this)
							}
						}),this);
					}
				}
			}
			window.myBar = new Chart(ctx, GraphObj);
		}
	}
};
