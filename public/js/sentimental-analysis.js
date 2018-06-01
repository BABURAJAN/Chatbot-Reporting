
	var feedback = {
						positive:{cmt:[],count:Number}, 
						negative:{cmt:[],count:Number}, 
						neutral:{cmt:[], count:Number}
					}
						
	function sfeedbacks(arr){

		//create options 
		/*var options = Object.keys(arr)			
		for(var i=0; i<options.length;i++){
			$("#dropdown").append('<option>' + options[i] + '</option>')			
		}*/
				
		
		var d=[]
		for(var i=0; i<options.length;i++){			
			$("#dropdown").append('<option>' + options[i] + '</option>')
			d.push({key:options[i], value:options[i]})
		}
		$("#BUselect").multiselect('dataprovider',[{key:1,value:1}, {key:2,value:2}]);		
		
		
		//init
		var selected = $("#dropdown option:selected").val()
		updateCount(arr, selected)
		
		//on change
		$("#dropdown").on('change', function(e){
			updateCount(arr, e.target.value)					
		})
		
		
		
		$('.view').click(function(e){
			$('.modal-body').empty()
			if(e.currentTarget.getAttribute('id') == 'fpositive'){
				$('.modal-title').text('Positive')				
				for(var i=0; i<feedback.positive.cmt.length; i++ ){
					$('.modal-body').append('<p>'+feedback.positive.cmt[i]+'</p>')
				}
			}else if(e.currentTarget.getAttribute('id') == 'fnegative'){
				$('.modal-title').text('Negative')				
				for(var i=0; i<feedback.negative.cmt.length; i++ ){
					$('.modal-body').append('<p>'+feedback.negative.cmt[i]+'</p>')
				}
			}else{	//neutral
				$('.modal-title').text('Neutral')				
				for(var i=0; i<feedback.neutral.cmt.length; i++ ){
					$('.modal-body').append('<p>'+feedback.neutral.cmt[i]+'</p>')
				}
			}
			
		});			
	}

			

	function updateCount(arr, key){			
		
		//reset
		feedback = {
					positive:{cmt:[],count:0}, 
					negative:{cmt:[],count:0}, 
					neutral:{cmt:[], count:0}
				}					

		for(var i=0; i<arr[key].length;i++){
			
			//count++
			if(arr[key][i].trc_sntmnt == 'positive'){
				feedback.positive.cmt.push(arr[key][i].trc);
				feedback.positive.count++;
			}else if(arr[key][i].trc_sntmnt == 'negative'){
				feedback.negative.cmt.push(arr[key][i].trc);
				feedback.negative.count++;
			}else{
				feedback.neutral.cmt.push(arr[key][i].trc);
				feedback.neutral.count++;
			}				
		}
		
		$('.feedback .pos .box p.txt').text(feedback.positive.count)		
		$('.feedback .neg .box p.txt').text(feedback.negative.count)	
		$('.feedback .neu .box p.txt').text(feedback.neutral.count)	
	}
