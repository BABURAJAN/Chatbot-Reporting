var arr;

var feedback = {
					positive:{cmt:[],count:Number}, 
					negative:{cmt:[],count:Number}, 
					neutral:{cmt:[], count:Number}
				}
					
function sfeedbacks(arr1){
	arr = arr1;
		
	//create options 
	var options = Object.keys(arr), dlist= [];		
	for(var i=0; i<options.length;i++){		
		dlist.push({'key':options[i], 'value':options[i]})
	}
	
	//bind all functionality
	$("#cucdropdown").multiselect('dataprovider', dlist);	
	$("input[name=BU-all]").unbind('change', this.onAllChange) 
	$("input[name=BU-all]").bind('change', this.onAllChange);  
	
	//all selection and init count		
	$("#cucdropdown").multiselect('selectAll', false);
	$("#cucdropdown").multiselect('refresh');
	updateCount()	
}



//show feedback
$('.view').click(function(e) {
	$('.modal-body').empty()
	if (e.currentTarget.getAttribute('id') == 'fpositive') {
		$('.modal-title').text('Positive')
		if (feedback.positive.cmt.length == 0) {
			$('.modal-body').append('<p>' + 'No Records To Show' + '</p>')
		} else {
			for (var i = 0; i < feedback.positive.cmt.length; i++) {
				$('.modal-body').append('<p>' + feedback.positive.cmt[i] + '</p>')
			}
		}
	} else if (e.currentTarget.getAttribute('id') == 'fnegative') {
		$('.modal-title').text('Negative')
		if (feedback.negative.cmt.length == 0) {
			$('.modal-body').append('<p>' + 'No Records To Show' + '</p>')
		} else {
			for (var i = 0; i < feedback.negative.cmt.length; i++) {
				$('.modal-body').append('<p>' + feedback.negative.cmt[i] + '</p>')
			}
		}
	} else { //neutral
		$('.modal-title').text('Neutral')
		if (feedback.neutral.cmt.length == 0) {
			$('.modal-body').append('<p>' + 'No Records To Show' + '</p>')
		} else {
			for (var i = 0; i < feedback.neutral.cmt.length; i++) {
				$('.modal-body').append('<p>' + feedback.neutral.cmt[i] + '</p>')
			}
		}
	}

});
		
		
//show all count
this.onAllChange = function(){
	var checked = $("input[name=BU-all]"). prop("checked");
	if(checked)
		$("#BUselect").multiselect('selectAll', true);
	else
		$("#BUselect").multiselect('deselectAll', false);
		
	updateCount() 
}


//show count
function updateCount(element, checked){			
	
	var slistElem = $('#cucdropdown option:selected');
	
	var slist = [];
	slistElem.each(function(i, d){
		slist.push($(this).val());
	});
	
	
	//reset
	feedback = {
				positive:{cmt:[],count:0}, 
				negative:{cmt:[],count:0}, 
				neutral:{cmt:[], count:0}
			}					
	
	for(var k=0; k<slist.length; k++){
		key = slist[k];
		for(var i=0; i<arr[key].length;i++){
			
			//count++
			if(arr[key][i].cuc_sntmnt == 'positive'){
				feedback.positive.cmt.push(arr[key][i].cuc);
				feedback.positive.count++;
			}else if(arr[key][i].cuc_sntmnt == 'negative'){
				feedback.negative.cmt.push(arr[key][i].cuc);
				feedback.negative.count++;
			}else{
				feedback.neutral.cmt.push(arr[key][i].cuc);
				feedback.neutral.count++;
			}				
		}
	}
	
	$('.feedback .pos .box p.txt').text(feedback.positive.count)		
	$('.feedback .neg .box p.txt').text(feedback.negative.count)	
	$('.feedback .neu .box p.txt').text(feedback.neutral.count)	
}
