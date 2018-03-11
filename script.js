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
}

function showPortfolioPopup(title,videoPath,desc,sourceLink)
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
}



$(document).ready(function(){ //after page load

	// alert($('.card').height());
	// //dynamic card height
	// $('.card').css("height", $(window).innerHeight()/2);
	// $(window).resize(function(){
	// 	$('.card').css("height", $(window).innerHeight()/2);
	// });

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
		$('html, body').animate({
			scrollTop: $(activeAnchor).offset().top
		}, 500);
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