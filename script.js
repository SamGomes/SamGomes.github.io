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
		rightsElement.text("Samuel Gomes Web Page @ " + monthNames[m] + " of " + y +".");

		$("#footer_contacts").hide();
	};

	var showResearchProjectPopup = function(title,desc)
	{
		$("#researchProjectPopup .modal-title").text($("#"+title).text());
		$("#researchProjectPopup_description").empty();
		$("#researchProjectPopup_description").append($("#"+desc).children().clone());

		$("#researchProjectPopup").modal();
	};
	exportedData.showResearchProjectPopup = showResearchProjectPopup;

	var showPortfolioPopup = function(title,videoPath,desc,sourceLink)
	{
		
	   $("#portfolioPopup .modal-title").text($("#"+title).text());
	   $("#portfolioPopup_description").empty();
	   $("#portfolioPopup_description").append($("#"+desc).children().clone());
	   $("#portfolioPopup_sourceLink").text($("#"+sourceLink).text());
	   $("#portfolioPopup_sourceLink").attr("href",$("#"+sourceLink).text());
	   
	   var popupVideo = $("#portfolioPopup_video");
	   var popupVideoTitle = $("#portfolioPopup_videoTitle");
	   if(videoPath==""){
		   popupVideoTitle.text("No Demo Video Available for this work. Sorry :(");
		   popupVideo.addClass("hidden");
	   }else{
		   popupVideo.removeClass("hidden");
		   popupVideoTitle.text("Demo Video:");
	   }
	   popupVideo.attr('src', videoPath);
	   
	   $("#portfolioPopup").modal();
	};
	exportedData.showPortfolioPopup = showPortfolioPopup;


	documentObj.ready(function(){ //after page load

		$(window).on("scroll", function() {
			var currentScroll = documentObj.scrollTop();  
			$("#codeBackgroundDarkEffects").css("transform","translateY("+ -currentScroll +"px)");
		});

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

		$('a').click(function(){ //animate anchor change
			activeAnchor = $(this).attr('data-anchorPoint');
			if(activeAnchor == null){
				return;
			}
		});


		$("#expandFooterTrigger").click(function(){
			var expandDuration = 500;

			if(!EXPANDED_FOOTER){
				$("#footer_contacts").show(expandDuration);
			}else{
				$("#footer_contacts").hide(expandDuration);
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