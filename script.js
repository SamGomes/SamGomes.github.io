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

	var lightColor = function(amount,originalColor){
		var newColor = [];
		for(var i=0; i<originalColor.length; i++){
			currentComponent = (1 - amount)*originalColor[i] + amount*255;
			newColor[i] = currentComponent; 
		}
		return newColor;
	}

	var extractData = function(dataPath){
		var returnedData = []
		return $.getJSON( dataPath, function(data) {
			returnedData = data;
			return returnedData;
		});
	}

	var updateCards = function(container, data)
	{
		container.fadeOut(300, function() {
	    	container.empty();
	    	container.hide();
			var currRow = $("<div class=\"row\"></div>");
			var id = 0;
			container.append(currRow);
			$.each(data, function( key, val ) {
				var logoPath = val.logoPath;
				var noLogo = (logoPath==undefined);
				if(noLogo){
					logoPath = "resources/images/portfolio/placeholder.png";
				}


				var HTMLString = `
						<div class="col-md-4">
							<div class="card">
								<img class="card-image" data-toggle="modal" alt="cardImage" src="`+logoPath+`">
								<p class="card-title" id="portfolio_title`+id+`">`+val.title+`</p>
							</div>
						</div>	
					`;

				var domElem = $(HTMLString);
				


				currRow.append(domElem);

				var domElemImages = domElem.find(".card-image");
				var domElemImage = domElemImages[0];


				domElemImages.on("click",function(){
					view.createPopup(val.title,val.videoPath,val.descriptionHTML,val.references);
				});

				if(noLogo){
					return;
				}
				domElemImages.on("load",function(){
					//get predominant image color
					var colorThief = new ColorThief();
					var imageColor = colorThief.getColor(domElemImage);
					//lighten image color by giving transparency
					domElem.find(".card").css("border-color", "rgb("+lightColor(0.85,imageColor)+")" );
					domElem.find(".card").css("background-color", "rgb("+lightColor(0.85,imageColor)+")" );
				});
				id++;
			});
	    	container.fadeIn(600);
		});
	};


	var createPopup = function(title,videoPath,desc,references)
	{
		
		var poppup = $(`
			<div class="modal fade" id="popup" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div class="modal-dialog modal-lg" role="document">
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

		if(title!=undefined){
			poppup.find(" .modal-title").text(title);
		}

		if(videoPath!=undefined){
			poppup.find(" .modal-body").append(`
					<hr></hr>
					<h3 style="text-align:left">Demo Video:</h3>
					<video id="popup_video" style="height: 100%; width: 100%;" controls="controls" src="`+videoPath+`"></video>
			`);
		}

		if(desc!=undefined){
			poppup.find(" .modal-body").append(`
					<hr></hr>
					<h3 style="text-align:left">Description:</h3>
					<div>`+desc+`</div>
			`);
		}
		if(references!=undefined){
			for(var i=0; i<references.length; i++){
				poppup.find(" .modal-body").append(`
					<hr></hr>
					<h3 style="text-align:left">References:</h3>
					<a target="_blank" href="`+references[i].href+`">`+references[i].text+`</a>
				`);
			}
		}

		poppup.modal();

		//make it self-destruct
		poppup.on('hide.bs.modal', function () {
		    poppup.remove();
		});
	};
	exportedData.createPopup = createPopup;


	var changeDisplayedCards = function(data,container,rangeDisplay,currDisplayedElements,limitIndex1,limitIndex2){

		currDisplayedElements.items = [];
		dataLength = data.length;
		
		if(currDisplayedElements.max > dataLength-1){
			limitIndex1 = 0;
			limitIndex2 = dataLength-1;
			updateCards(container, data);
		}else{

			limitIndex1 = (limitIndex1<0)? dataLength + limitIndex1: limitIndex1;
			limitIndex1 = limitIndex1 % dataLength;

			limitIndex2 = (limitIndex2<0)? dataLength + limitIndex2: limitIndex2;
			limitIndex2 = limitIndex2 % dataLength;

			var i=limitIndex1;
			while(i!=limitIndex2){
				currDisplayedElements.items.push(data[i]);
				i++;
				i = (i<0)? dataLength + i: i;
				i = i % dataLength;
			}

			currDisplayedElements.min = limitIndex1;
			currDisplayedElements.max = limitIndex2;

			updateCards(container, currDisplayedElements.items);
		}

		rangeDisplay.text("Showing entries ["+(limitIndex1+1)+" .. "+(limitIndex2+1)+"] of "+dataLength);
	}


	documentObj.ready(function(){ //after page load

		var portfolioDataExtractor = extractData("portfolioData.json");
		var portfolioData = [];
		var currDisplayedPD = {
			items: [],
			min: 0,
			max: 3,
			span: 1
		};
		portfolioDataExtractor.done(function() {
			portfolioData = portfolioDataExtractor.responseJSON.reverse();
			changeDisplayedCards(portfolioData,$("#portfolioContainer"),$("#portfolio_range_display"),currDisplayedPD,currDisplayedPD.min, currDisplayedPD.max);
		});


		var researchProjectsDataExtractor = extractData("researchProjectsData.json");
		var researchProjectsData = [];
		var currDisplayedRPD = {
			items: [],
			min: 0,
			max: 3,
			span: 1
		};
		researchProjectsDataExtractor.done(function() {
			researchProjectsData = researchProjectsDataExtractor.responseJSON.reverse();
			changeDisplayedCards(researchProjectsData,$("#researchProjectsContainer"),$("#researchProjects_range_display"),currDisplayedRPD,currDisplayedRPD.min, currDisplayedRPD.max);
		});

		var publicationsDataExtractor = extractData("publicationsData.json");
		var publicationsData = [];
		var currDisplayedPbD = {
			items: [],
			min: 0,
			max: 3,
			span: 1
		};
		publicationsDataExtractor.done(function() {
			publicationsData = publicationsDataExtractor.responseJSON.reverse();
			changeDisplayedCards(publicationsData,$("#publicationsContainer"),$("#publications_range_display"), currDisplayedPbD, currDisplayedPbD.min, currDisplayedPbD.max);
		});
		

		$("#portfolio_left_arrow").on("click",function(){
			changeDisplayedCards(portfolioData,$("#portfolioContainer"),$("#portfolio_range_display"), currDisplayedPD, (currDisplayedPD.min - currDisplayedPD.span), (currDisplayedPD.max - currDisplayedPD.span));
		});
		$("#portfolio_right_arrow").on("click",function(){
			changeDisplayedCards(portfolioData,$("#portfolioContainer"),$("#portfolio_range_display"), currDisplayedPD, (currDisplayedPD.min + currDisplayedPD.span), (currDisplayedPD.max + currDisplayedPD.span));
		});

		$("#researchProjects_left_arrow").on("click",function(){
			changeDisplayedCards(researchProjectsData,$("#researchProjectsContainer"),$("#researchProjects_range_display"), currDisplayedRPD, (currDisplayedRPD.min - currDisplayedRPD.span), (currDisplayedRPD.max - currDisplayedRPD.span));
		});
		$("#researchProjects_right_arrow").on("click",function(){
			changeDisplayedCards(researchProjectsData,$("#researchProjectsContainer"),$("#researchProjects_range_display"), currDisplayedRPD, (currDisplayedRPD.min + currDisplayedRPD.span), (currDisplayedRPD.max + currDisplayedRPD.span));
		});

		$("#publications_left_arrow").on("click",function(){
			changeDisplayedCards(publicationsData,$("#publicationsContainer"),$("#publications_range_display"), currDisplayedPbD, (currDisplayedPbD.min - currDisplayedPbD.span), (currDisplayedPbD.max - currDisplayedPbD.span));
		});
		$("#publications_right_arrow").on("click",function(){
			changeDisplayedCards(publicationsData,$("#publicationsContainer"),$("#publications_range_display"), currDisplayedPbD, (currDisplayedPbD.min + currDisplayedPbD.span), (currDisplayedPbD.max + currDisplayedPbD.span));
		});
		//retrieve data from db server and create cards
		// createCards($("#researchProjectsContainer"),"researchProjectsData.json");
		// createCards($("#publicationsContainer"),"publicationsData.json");


		

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