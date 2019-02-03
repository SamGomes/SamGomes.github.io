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


	var createCards = function(container,dataPath)
	{
		$.getJSON( dataPath, function( data ) {
			var currRow = $("<div class=\"row\"></div>");
			var id = 0;
			container.append(currRow);
			$.each( data, function( key, val ) {
				var logoPath = val.logoPath;
				if(logoPath==undefined){
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
				domElem.find(".card-image").on("click",function(){
					console.log("clicked");
					view.createPopup(val.title,val.videoPath,val.descriptionHTML,val.references);
				});
				currRow.append(domElem);
				id++;
			});
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
	};
	exportedData.createPopup = createPopup;


	documentObj.ready(function(){ //after page load


		//retrieve data from db server and create cards
		createCards($("#portfolioContainer"),"portfolioData.json");
		createCards($("#researchProjectsContainer"),"researchProjectsData.json");
		createCards($("#publicationsContainer"),"publicationsData.json");

		

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