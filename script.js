
$(document).ready(function(){ //after page load
	var view = (function($, undefined){

		var cvOptionsText = $("#cvButton").html()
		$("#cvButton").on("click",function(){
			if($("#cvOptions").is(":hidden")){
				$("#cvButton").html(cvOptionsText+" >")
				$("#cvOptions").show(500);
			}else{
				$("#cvButton").html(cvOptionsText)
				$("#cvOptions").hide(500);
			}
		});
		
		var exportedData = {};
		var backgroundTimer = undefined; //will contain the timer for the background effects loop

		//play song on load
		//document.getElementById("my_audio").play();
		var rights =  new Date();
		y = rights.getFullYear();
		m = rights.getMonth();
		d = rights.getDate();

		var coverPhrases = 
		[
			"\"Hi! I am Sam, welcome to my website! 😀 <br> \
				I work as a CS engineer, PhD student, and TA. <br> \
				I also like to sing and to play music. 🎤🎧🎶🎸\"", 
			"\"Hi! I am Sam, welcome to my website! 😀 <br> \
				I work as a CS engineer, PhD student, and TA. <br> \
				This is not a Tinder description, <br> \
				 thus I will not get more casual than this...\"", 
			"\"Hi! I am Sam, welcome to my website! 😀 <br> \
				I work as a CS engineer, PhD student, and TA. <br> \
				You can check out my work in the sections below.\"", 
			"\"Hi! I am Sam, welcome to my website! 😀 <br> \
				I work as a CS engineer, PhD student, and TA. <br> \
			    Do you like good looking professional websites? \n \
				I hope this one meets your requirements... 😅\"", 
			"\"Hey Hey Hey! Helloooo visitaaant! I am Sam, welcome to my website! 😀 <br> \
				I work as a CS engineer, PhD student, and TA. <br> \
				You can check out my portfolio in the sections below.\"", 
			"\"Hi! I am Sam, welcome to my website! 😀 <br> \
				I work as a CS engineer, PhD student, and TA. <br> \
				I had a cringy saying here, but I removed it. 😅\"", 
			"\"Hi! I am Sam, welcome to my website! 😀 <br> \
				I work as a CS engineer, PhD student, TA, <br> \
				and I can present a different saying here in every refresh. 👾\"", 
			"\"Hi! I am Sam, welcome to my website! 😀 <br> \
				I work as a CS engineer, PhD student, and TA. <br> \
				As a PhD student, I have the opportunity to <br> \
				use my knowledge to create new things!\"", 
			"\"Hi! I am Sam, welcome to my website! 😀 <br> \
				I work as a CS engineer, PhD student, and TA. <br> \
				Oh no! A wild m̶i̴s̴s̴i̷n̴g̸n̷o̷ appeared! 😨 <br> \
				<h5>|˜Ž­|　<br> |‡g|　<br> |¾ù|　<br> |åm|__<br> |ïãëw|<br> |ú¥ê2|<br> |)å¬7|<br> |…¾¥ˆ|<br></h5>\""
		];


		var randomNum = Math.random()*coverPhrases.length;
		var randWebsiteMode = Math.floor(randomNum);
		if(randomNum >= 8){
			if(randomNum < 8.7){
				randWebsiteMode = Math.floor(Math.random()*(coverPhrases.length-1));
			}
		}
		var isEasterEgged = (randWebsiteMode == 8);
		isEasterEgg = true;
		$("#coverContainerText").html(coverPhrases[randWebsiteMode]);


		var monthNames = ["January", "February", "March", "April", "May", "June",
						  "July", "August", "September", "October", "November", "December"];

		var rightsElement = $("#rightsText");
		rightsElement.append("Samuel Gomes Web Page @ " + monthNames[m] + " " + y +". <br> Unless stated otherwise in the works themselves, the rights are reserved to me as well as the other authors of the work presented here.");

		$("#footerContacts").hide(300);
		window.location.href = "#";
		// window.setTimeout(function(){
		// 	window.location.href = "#anchor_portfolio";
		// 	clearInterval(backgroundTimer);
		// },3000);
	

		var lightColor = function(amount, originalColor){
			// return originalColor;
			var newColor = [];
			for(var i=0; i<originalColor.length; i++){
				if(isEasterEgged){
					newColor[i] = Math.random()*255; 					 
				}else{
					currentComponent = (1 - amount)*originalColor[i] + amount*255;
					newColor[i] = currentComponent; 					
				}
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

		var buildCards = function(currRow, val, id, logoPath){
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

			var domElemCards = domElem.find(".card");
			var domElemCard = domElemCards[0];

			var domElemImages = domElem.find(".card-image");
			var domElemImage = domElemImages[0];

			domElemCards.on("click",function(){
				view.createPopup(val.title,val.videoPath,val.descriptionHTML,val.references, val.website);
			});

			domElemImages.on("load",function(){
				//get predominant image color
				var colorThief = new ColorThief(); 
				var imageColor = colorThief.getColor(domElemImage);
				//lighten image color by giving transparency
				// domElem.find(".card").css("border-color", "rgba("+lightColor(0.75, imageColor)+")" );
				domElem.find(".card").css("background-color", "rgba("+lightColor(0.9, imageColor)+",0.65)" );
			});
		}


		var updateCards = function(container, data)
		{

			
			container.fadeOut(300, function() {
				var currRow = $("<div class=\"row\" container-cards></div>");
				var id = 0;
				container.empty();
				container.hide();
				container.append(currRow);
				$.each(data, function( key, val ) {
					var logoPath = val.logoPath;
					if(logoPath == undefined){
						logoPath = "resources/images/portfolio/placeholder.png";
					}
					buildCards(currRow, val, id, logoPath);
					id++;
				});
		    	container.fadeIn(600);
			});
		};


		var createPopup = function(title,videoPath,desc,references,website)
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
				if(references.title != undefined){
					poppup.find(" .modal-body")
					.append(`<h3 style="text-align:left">`+references.title+`:</h3>`);
				}
				for(var i=0; i<references.items.length; i++){
					currRefItem = references.items[i];
					if(currRefItem.text != undefined){
						if(currRefItem.href != undefined){
							poppup.find(" .modal-body")
							.append(`
								<hr></hr>
								<a target="_blank" href="`+references.items[i].href+`">`+references.items[i].text+`</a>
							`);
						}else{
							poppup.find(" .modal-body")
							.append(`
								<hr></hr>
								<a>`+references.items[i].text+`</a>
							`);
						}
					}
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
			
			if((currDisplayedElements.max-currDisplayedElements.min) > dataLength-2){
				limitIndex1 = 0
				limitIndex2 = dataLength-1
				updateCards(container, data);
			}else{
				limitIndex1 = (limitIndex1<0)? dataLength + limitIndex1: limitIndex1;
				limitIndex1 = limitIndex1 % dataLength;

				limitIndex2 = (limitIndex2<0)? dataLength + limitIndex2: limitIndex2;
				limitIndex2 = limitIndex2 % dataLength;

				var i=limitIndex1;
				while(i!=((limitIndex2+1)%dataLength)){
					i = (i+1) % dataLength;
					// i = (i<0)? dataLength + i: i;
					// i = i % dataLength;
					currDisplayedElements.items.push(data[i]);
				}

				currDisplayedElements.min = limitIndex1;
				currDisplayedElements.max = limitIndex2;

				updateCards(container, currDisplayedElements.items);
			}

			rangeDisplay.text("Showing entries ["+(limitIndex1+1)+" .. "+(limitIndex2+1)+"] of "+dataLength);
		}



		var portfolioDataExtractor = extractData("./portfolioData.json");
		var portfolioData = [];
		var currDisplayedPD = {
			items: [],
			min: 0,
			max: 2,
			span: 1
		};
		portfolioDataExtractor.done(function() {
			portfolioData = portfolioDataExtractor.responseJSON.reverse();
			changeDisplayedCards(portfolioData, $("#portfolioContainer"), $("#portfolio_range_display"),currDisplayedPD,currDisplayedPD.min, currDisplayedPD.max);
		});


		var researchProjectsDataExtractor = extractData("./researchProjectsData.json");
		var researchProjectsData = [];
		var currDisplayedRPD = {
			items: [],
			min: 0,
			max: 2,
			span: 1
		};
		researchProjectsDataExtractor.done(function() {
			researchProjectsData = researchProjectsDataExtractor.responseJSON.reverse();
			changeDisplayedCards(researchProjectsData, $("#researchProjectsContainer"), $("#researchProjects_range_display"),currDisplayedRPD,currDisplayedRPD.min, currDisplayedRPD.max);
		});

		var publicationsDataExtractor = extractData("./publicationsData.json");
		var publicationsData = [];
		var currDisplayedPbD = {
			items: [],
			min: 0,
			max: 2,
			span: 1
		};
		publicationsDataExtractor.done(function() {
			publicationsData = publicationsDataExtractor.responseJSON.reverse();
			changeDisplayedCards(publicationsData, $("#publicationsContainer"), $("#publications_range_display"), currDisplayedPbD, currDisplayedPbD.min, currDisplayedPbD.max);
		});

		var workExperienceDataExtractor = extractData("./workExperienceData.json");
		var workExperienceData = [];
		var currDisplayedWE = {
			items: [],
			min: 0,
			max: 2,
			span: 1
		};
		workExperienceDataExtractor.done(function() {
			workExperienceData = workExperienceDataExtractor.responseJSON.reverse();
			changeDisplayedCards(workExperienceData, $("#workExperienceContainer"), $("#workExperience_range_display"), currDisplayedWE, currDisplayedWE.min, currDisplayedWE.max);
		});
	
		var extracurricularDataExtractor = extractData("./extracurricularData.json");
		var extracurricularData = [];
		var currDisplayedEC = {
			items: [],
			min: 0,
			max: 2,
			span: 1
		};
		extracurricularDataExtractor.done(function() {
			extracurricularData = extracurricularDataExtractor.responseJSON.reverse();
			changeDisplayedCards(extracurricularData, $("#extracurricularContainer"), $("#extracurricular_range_display"), currDisplayedEC, currDisplayedEC.min, currDisplayedEC.max);
		});	

		$("#portfolio_left_arrow").on("click",function(){
			changeDisplayedCards(portfolioData, $("#portfolioContainer"),$("#portfolio_range_display"), currDisplayedPD, (currDisplayedPD.min - currDisplayedPD.span), (currDisplayedPD.max - currDisplayedPD.span));
		});
		$("#portfolio_right_arrow").on("click",function(){
			changeDisplayedCards(portfolioData, $("#portfolioContainer"),$("#portfolio_range_display"), currDisplayedPD, (currDisplayedPD.min + currDisplayedPD.span), (currDisplayedPD.max + currDisplayedPD.span));
		});

		$("#researchProjects_left_arrow").on("click",function(){
			changeDisplayedCards(researchProjectsData, $("#researchProjectsContainer"),$("#researchProjects_range_display"), currDisplayedRPD, (currDisplayedRPD.min - currDisplayedRPD.span), (currDisplayedRPD.max - currDisplayedRPD.span));
		});
		$("#researchProjects_right_arrow").on("click",function(){
			changeDisplayedCards(researchProjectsData, $("#researchProjectsContainer"),$("#researchProjects_range_display"), currDisplayedRPD, (currDisplayedRPD.min + currDisplayedRPD.span), (currDisplayedRPD.max + currDisplayedRPD.span));
		});

		$("#publications_left_arrow").on("click",function(){
			changeDisplayedCards(publicationsData, $("#publicationsContainer"),$("#publications_range_display"), currDisplayedPbD, (currDisplayedPbD.min - currDisplayedPbD.span), (currDisplayedPbD.max - currDisplayedPbD.span));
		});
		$("#publications_right_arrow").on("click",function(){
			changeDisplayedCards(publicationsData, $("#publicationsContainer"),$("#publications_range_display"), currDisplayedPbD, (currDisplayedPbD.min + currDisplayedPbD.span), (currDisplayedPbD.max + currDisplayedPbD.span));
		});

		$("#workExperience_left_arrow").on("click",function(){
			changeDisplayedCards(workExperienceData, $("#workExperienceContainer"),$("#workExperience_range_display"), currDisplayedWE, (currDisplayedWE.min - currDisplayedWE.span), (currDisplayedWE.max - currDisplayedWE.span));
		});
		$("#workExperience_right_arrow").on("click",function(){
			changeDisplayedCards(workExperienceData, $("#workExperienceContainer"),$("#workExperience_range_display"), currDisplayedWE, (currDisplayedWE.min + currDisplayedWE.span), (currDisplayedWE.max + currDisplayedWE.span));
		});

		$("#extracurricular_left_arrow").on("click",function(){
			changeDisplayedCards(extracurricularData, $("#extracurricularContainer"),$("#extracurricular_range_display"), currDisplayedEC, (currDisplayedEC.min - currDisplayedEC.span), (currDisplayedEC.max - currDisplayedEC.span));
		});
		$("#extracurricular_right_arrow").on("click",function(){
			changeDisplayedCards(extracurricularData, $("#extracurricularContainer"),$("#extracurricular_range_display"), currDisplayedEC, (currDisplayedEC.min + currDisplayedEC.span), (currDisplayedEC.max + currDisplayedEC.span));
		});
		//retrieve data from db server and create cards
		// createCards($("#researchProjectsContainer"),"researchProjectsData.json");
		// createCards($("#publicationsContainer"),"publicationsData.json");


		

		//background stuff
		documentHeight = $(document).height();
		var codeBackgroundDarkEffects = $("#codeBackgroundDarkEffects");
		codeBackgroundDarkEffects.css("transform","translateY(0px)");
		
		//make background effect move a little in sin way
		var backgroundEffectFunc = function(){
			var frameRatioIncrement = 0.008;
			if(isEasterEgged){
				frameRatioIncrement = 0;
			}
			
			var currI = 0;
			backgroundTimer = window.setInterval(function(){ 
				var currEffectsOffset = parseFloat(codeBackgroundDarkEffects.css('transform').split(/[(,)]/)[6]);
				var currentScroll = parseFloat($(document).scrollTop());  

				//do linear interpolation for animations using translations
				currI = (currI>2*Math.PI)? currI=frameRatioIncrement : currI+=frameRatioIncrement;
				var ratio = Math.sin(currI)*0.2;
				var newOffset = ratio*window.screen.height;

				codeBackgroundDarkEffects.css("transform","translateY("+ parseFloat(-currentScroll+newOffset) +"px)");
				$("#codeBackgroundOverlay").css("transform","translateY("+ parseFloat((currentScroll*0.95-newOffset*0.1)) +"px)");
				
				currentScroll*=0.2;
				$("#anchor_portfolio").css("transform","translateY("+ parseFloat(-currentScroll) +"px)");
				$("#anchor_workExperience").css("transform","translateY("+ parseFloat(-currentScroll) +"px)");
				// $("#anchor_workExperience").css("opacity",1.0 - parseFloat(2*currentScroll)/(documentHeight/2.0));
				$("#anchor_researchProjects").css("transform","translateY("+ parseFloat(-currentScroll) +"px)");
				$("#anchor_publications").css("transform","translateY("+ parseFloat(-currentScroll) +"px)");
				$("#anchor_extracurricular").css("transform","translateY("+ parseFloat(-currentScroll) +"px)");
				$("#rights").css("transform","translateY("+ parseFloat(-currentScroll) +"px)");

				if(isEasterEgged){
					codeBackgroundDarkEffects.css("transform","translateX("+ parseFloat(Math.random()*100) +"px)");
				}

				if(codeBackgroundDarkEffects.is(":hidden")){
					window.clearInterval(backgroundTimer);
				}
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

		// $("#coverDownArrow").mouseover(function(){
		// 	$("#scrollDownText").css("color", "rgba(186,100,255,1)");
		// });
		// $("#coverDownArrow").mouseout(function(){
		// 	$("#scrollDownText").css("color", "rgba(255,100,0,1)");
		// });
			
			

		return exportedData;

	}( jQuery ));

});
