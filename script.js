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

	var createCards = function(container,dataPath)
	{
		$.getJSON( dataPath, function( data ) {
			var currRow = $("<div class=\"row\"></div>");
			var id = 0;
			container.append(currRow);
			$.each( data, function( key, val ) {
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
					console.log(domElemImage)
					//get predominant image color
					var colorThief = new ColorThief();
					var imageColor = colorThief.getColor(domElemImage);
					console.log(imageColor);
					//lighten image color by giving transparency
					domElem.find(".card").css("border-color", "rgb("+lightColor(0.85,imageColor)+")" );
					domElem.find(".card").css("background-color", "rgb("+lightColor(0.85,imageColor)+")" );
				});

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

		//make it self-destruct
		poppup.on('hide.bs.modal', function () {
		    poppup.remove();
		});
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