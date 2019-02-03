var documentObj = $(document);

var view = (function($, undefined){

	var exportedData = {};

	//play song on load
	window.onload = function() {
		//document.getElementById("my_audio").play();
		var rights =  new Date();
		y = rights.getFullYear();
		m = rights.getMonth();
		d = rights.getDate();

		var monthNames = ["January", "February", "March", "April", "May", "June",
						  "July", "August", "September", "October", "November", "December"];

		var rightsElement = $("#rightsText");
		rightsElement.append("Samuel Gomes Web Page @ " + monthNames[m] + " of " + y +". <br> Unless stated otherwise in the works themselves, the rights are reserved to me as well as the other authors of the work presented here.");

		$("#footerContacts").hide();
	};


	var showPopup = function(title,videoPath,desc,sourceLink)
	{
		
		var poppup = $(`
			<div class="modal fade" id="popup" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h4 class="modal-title"></h4>
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
						</div>
						<div class="modal-body">
						</div>
					</div>
				</div>
			</div>
		`);

		if(title!=""){
			poppup.find(" .modal-title").text($("#"+title).text());
		}

		if(videoPath!=""){
			poppup.find(" .modal-body").append(`
					<h3 style="text-align:left">Demo Video:</h3>
					<video id="popup_video" style="height: 100%; width: 100%;" controls="controls" src="`+videoPath+`"></video>
			`);
		}

		if(desc!=""){
			poppup.find(" .modal-body").append(`
					<h3 style="text-align:left">Description:</h3>
					<div>`+$("#"+desc).html()+`</div>
			`);
		}
		if(sourceLink!=""){
			var sourceLinkText = $("#"+sourceLink).text();
			poppup.find(" .modal-body").append(`
					<h3 style="text-align:left">Source Link:</h3>
					<a target="_blank" href="`+sourceLinkText+`">`+sourceLinkText+`</a>
			`);
		}

		poppup.modal();
	};
	exportedData.showPopup = showPopup;


	documentObj.ready(function(){ //after page load


		//retrieve data from db server
		$.getJSON( "portfolioData.json", function( data ) {
			var currRow = $("<div class=\"row\"></div>");
			var id = 0;
			$("#portfolioContainer").append(currRow);
			$.each( data, function( key, val ) {
				var logoPath = val.logoPath;
				if(logoPath==""){
					logoPath = "resources/images/portfolio/placeholder.png";
				}
				var portfolioHTML = `
						<div class="col-md-4">
							<div class="card">
								<img class="card-image" data-toggle="modal"  onclick=view.showPopup("portfolio_title`+id+`","`+val.videoPath+`","portfolio_desc`+id+`","portfolio_source`+id+`") alt="cardImage" src="`+logoPath+`" >
								<p class="card-title" id="portfolio_title`+id+`">`+val.title+`</p>
								<div class="d-none" id="portfolio_desc`+id+`">
									`+val.descriptionHTML+`
								</div>
								<p class="d-none" id="portfolio_source`+id+`">`+val.source+`</p>
							</div>
						</div>	
					`;
				currRow.append(portfolioHTML)
				id++;
			});
		});
		$.getJSON( "researchProjectsData.json", function( data ) {
			var currRow = $("<div class=\"row\"></div>");
			var id = 0;
			$("#researchProjectsContainer").append(currRow);
			$.each( data, function( key, val ) {
				var researchTopicsHTML = `
						<div class="col-md-4">
							<div class="card">
								<img class="card-image" data-toggle="modal"  onclick=view.showPopup("researchProjects_title`+id+`","","researchProjects_desc`+id+`","") alt="cardImage" src="`+val.logoPath+`">
								<p class="card-title" id="researchProjects_title`+id+`">`+val.title+`</p>
								<div class="d-none" id="researchProjects_desc`+id+`">
									`+val.descriptionHTML+`
								</div>
							</div>
						</div>	
					`;
				currRow.append(researchTopicsHTML)
				id++;
			});
		});
		$.getJSON( "publicationsData.json", function( data ) {
			var currRow = $("<div class=\"row\"></div>");
			var id = 0;
			$("#publicationsContainer").append(currRow);
			$.each( data, function( key, val ) {
				var publicationsHTML = `
						<div class="col-md-4">
							<div class="card">
								<img class="card-image" data-toggle="modal"  onclick=view.showPopup("publications_title`+id+`","","publications_desc`+id+`","") alt="cardImage" src="`+val.logoPath+`">
								<p class="card-title" id="publications_title`+id+`">`+val.title+`</p>
								<div class="d-none" id="publications_desc`+id+`">
									`+val.references[0]+`
								</div>
							</div>
						</div>	
					`;
				currRow.append(publicationsHTML)
				id++;
			});
		});


		//background stuff
		var codeBackgroundDarkEffects = $("#codeBackgroundDarkEffects");
		codeBackgroundDarkEffects.css("transform","translateY(0px)");
		//make background effect move a little in sin way
		var backgroundEffectFunc = function(){
			var frameRatioIncrement = 0.016;
			var currI = 0;
			window.setInterval(function(){ 
				var currEffectsOffset = parseFloat(codeBackgroundDarkEffects.css('transform').split(/[(,)]/)[6]);
				var currentScroll = parseFloat(documentObj.scrollTop());  

				//do linear interpolation for animations using translations
				currI = (currI>2*Math.PI)? currI=frameRatioIncrement : currI+=frameRatioIncrement;
				var ratio = Math.sin(currI)*0.2;
				var newOffset = ratio*window.screen.height;

				codeBackgroundDarkEffects.css("transform","translateY("+ parseFloat(-currentScroll+newOffset) +"px)");
			}, 41);
		}();

		var EXPANDED_FOOTER=false;

		$('#portfolioPopup').on('hidden.bs.modal', function () {
			$('video').each(function() {
				$(this).get(0).pause();
			});
		});
		
		$('img').hover(function() {
			if($(this).hasClass("portfolioTooltiped")){
				$(this).attr("title","Click for more info");      			
			}
		});

		var cards = $(".card");
		for(var i=0; i < cards.length; i++){
			var currCard = $(cards[i]);
			var currImage = currCard.find(".card-image")[0];
			
			//get predominant image color
			var imageColor = (new Vibrant(currImage)).VibrantSwatch;
			//checking if color could be found in the palette
			if(imageColor!=undefined){
				//lighten image color by giving transparency
				currCard.css("background-color", imageColor.getHex()+"33");
			}
		}

		$("#expandFooterTrigger").click(function(){
			var expandDuration = 500;

			if(!EXPANDED_FOOTER){
				$("#footerContacts").show(expandDuration);
			}else{
				$("#footerContacts").hide(expandDuration);
			}
			EXPANDED_FOOTER=!EXPANDED_FOOTER;
		});

		$("#coverDownArrow").mouseover(function(){
			$("#scrollDownText").css("color", "rgba(186,100,255,1)");
		});
		$("#coverDownArrow").mouseout(function(){
			$("#scrollDownText").css("color", "rgba(255,100,0,1)");
		});
		
		
	});

	return exportedData;

}( jQuery ));