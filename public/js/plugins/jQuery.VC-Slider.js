(function ($){

	$.vcSlider = function(element, options) {

		/**********************
			DEFAULT Settings
		***********************/
		var defaults = {
			'showStatus'	: true,				// Displays the slide counter and slide total. I.E.: 2/10
			'navigation'	: true,				// Displays the next and previous buttons
			'navPrevious'	: "Previous",		// Text to be used in the previous button
			'navNext'		: "Next",			// Text to be used in the next button
			'keyboardArrows': true,				// Enables keyboard input (left and right arrows)
			'labelLinks'	: true,				// Displays container with individual text navigation
			'auto'			: false,			// Automatically starts slider
			'waitTime'		: 2000,				// Time in miliseconds to wait between transitions
			'effects'		: 'moonwalk',		// Transition effects: 'moonwalk' = slide, 'theonering' = fade
			'looping'		: 'stop',			// Looping options: 'stop' = stops at begining and end, 'jump' = jumps between first and last (vice-versa), 'infinite' = endless loop
			'swipeAmount'	: 88				// How many pixels does the user needs to drag for the slider to go to next/previous slide
		};



		/******************************************
			SETUP Settings and Plugin elements
		*******************************************/
		// current instance of plugin
		var plugin = this;

		// settings container
		plugin.settings = {};

		// Apply user options to defaults
		plugin.settings = $.extend({}, defaults, options);

		// Put target element into property
		plugin.element = element;

		// README: [research] this (above) can be an array if more elements has same class?



		/****************************************************
			CREATE vars that represent elements in slider
		*****************************************************/
		var $container = plugin.element,
			$slidesViewport = $container.children(".vcslider-viewport"),
			$slidesList = $slidesViewport.children("ul"),
			$slideItem = $slidesList.children("li"),
			slidesStatus,
			slidesCounter = $slideItem.length,
			currentSlide = 0,
			currentWidth = $container.width(),
			slideInterval = null,
			visibleArea = $($slideItem).width(),  // for infinite scroll
			previewArea = (currentWidth-visibleArea)/2,  // for infinite scroll
			infinitePages = 0, // for infinite scroll
			currentPage = 2, // for infinite scroll
			uniqueSlides = slidesCounter; // for infinite scroll


		var init = function(){


			/********************************
				CREATES additional markup
			********************************/
			
			// Creates status bar
			if(plugin.settings.showStatus){
				if( !$('.vcslider-status').length ){
					$('.img-nav').append("<span class='vcslider-status'></span>");
				}
				slidesStatus = $('.img-nav').children(".vcslider-status");
				updateStatus();
			}

			// Creates previous & next markup
			if (plugin.settings.navigation && !$('.vcslider-previous').length) {
				// $container.append("<a class='vcslider-previous'>" + plugin.settings.navPrevious + "</a>");
				// $container.append("<a class='vcslider-next'>" + plugin.settings.navNext + "</a>");
				$('.img-nav').prepend("<a class='vcslider-previous'>" + plugin.settings.navPrevious + "</a>");
				$('.img-nav').append("<a class='vcslider-next'>" + plugin.settings.navNext + "</a>");
			}

			// Creates label navigation
			if(plugin.settings.labelLinks){
				$container.append("<ul class='vcslider-labels'>");
				$slideItem.each(function(index){
					$container.children(".vcslider-labels").append("<li data-vcslider-frame='" + index + "'>" + $(this).attr("data-vcslider") + "</li>");
				});
				$container.append("</ul>");
				$("li[data-vcslider-frame=0]").addClass("selected");
			}
			
			// For infinite scroll, clone some offers
			if (plugin.settings.looping === "infinite") {
				//Hide the scrollbar
				$($slidesViewport).css("overflow", "hidden");
				
				//Set width of previous & next buttons
				if (plugin.settings.navigation) {
					$(".vcslider-previous").width(previewArea);
					$(".vcslider-next").width(previewArea);
					
					//Add a new CSS class to cater for small screens
					if(previewArea <= 30) {
						$(".vcslider-previous").addClass('vcslider-compact');
						$(".vcslider-next").addClass('vcslider-compact');
					}
				}
				
				if(slidesCounter >= 3) {
					// Clone the first 3 offers
					$($slideItem).slice(0,3).clone().appendTo($slidesList);
					
					// Clone the last three offers
					$($slideItem).slice(-3).clone().prependTo($slidesList);
				}
				else {
					// Less than three unique offers, clone them twice
					$($slideItem).clone().appendTo($slidesList);
					$($slideItem).clone().appendTo($slidesList);
				}
				
				// Update the cached variables with new items
				$slideItem = $slidesList.children("li");
				slidesCounter = $slideItem.length;
								
				//Set scrollLeft position
				//Check if previous and next buttons are visible, as this impacts the scroll position
				if($(".vcslider-next").is(":visible")) {
					$slidesViewport.scrollLeft((visibleArea*3)-previewArea);
				}
				else {
					visibleArea = currentWidth;
					previewArea = 0;
					$slidesViewport.scrollLeft((visibleArea*3));					
				}
				
				// Set the number of scrollable slides
				infinitePages = Math.ceil(slidesCounter-4);
			}
			
			/********************
				WINDOW EVENTS
			*********************/
			// Update dimensions on browse resize
			$(window).resize(function () {
				resizer();
			});



			/*******************
				MOUSE EVENTS
			********************/
			// Clicked next
			$('.img-nav').find(".vcslider-next").click(function() {
				intervalStop()
				moveSlider('next');
				intervalStart();
			});

			// Clicked previous
			$('.img-nav').find(".vcslider-previous").click(function() {
				intervalStop()
				moveSlider('previous');
				intervalStart();
			});

			// Clicked on label navigation
			$container.find("li[data-vcslider-frame]").click(function() {
				intervalStop()
				var newSlidePosition = parseInt($(this).attr("data-vcslider-frame"), 10);
				moveSlider(newSlidePosition);
				intervalStart();
			});



			/**********************
				KEYBOARD EVENTS
			***********************/
			if (plugin.settings.keyboardArrows) {
				$(document).keydown(function(event){
					// Keyboard arrow right
					if ( event.which === 39 ) {
						intervalStop()
						moveSlider('next');
						intervalStart();
					} else{
						// Keyboad arrow left
						if ( event.which === 37 ) {
							intervalStop()
							moveSlider('previous');
							intervalStart();
						}
					}
				});
			}

			

			/********************
				TOUCH EVENTS
			*********************/
			var touchStartX = 0, 
				touchStartY = 0, 
				touchCurrentX = 0,
				touchCurrentY = 0,
				originalPosition = 0,
				previousDrag = 0,
				isScrolling;

			// START
			// Make sure addEventListener is supported (IE8 and below)
			if (document.addEventListener) {
				$slidesList[0].addEventListener("touchstart", function(e) {
					// disables transition
					$slidesList.addClass("noTransitions");
					intervalStop();
		
					// Get initial touch coordinates
					touchStartX = e.touches[0].pageX;
					touchStartY = e.touches[0].pageY;
	
					// Get original translate value
					originalPosition = getCssTransformTranslate();				
				}, false); 
	
				// DURING
				$slidesList[0].addEventListener("touchmove", function(e){
					// If user is scrolling, then do nothing. This will be reset in touchend.
					if ( isScrolling !== true ) {
						// Get current touch coordinates
						touchCurrentX = e.touches[0].pageX;
						touchCurrentY = e.touches[0].pageY;
						
						// Tests whether the user is scrolling or swiping by checking if the touch movement is more horizontal than vertical (or it has already started a swipe)
						if (((Math.abs(touchStartX - touchCurrentX) > Math.abs(touchStartY - touchCurrentY)) && (Math.abs(Math.abs(touchStartX - touchCurrentX) - Math.abs(touchStartY - touchCurrentY))>2) ) || (isScrolling===false)){
							isScrolling = false;
						}
						else {
							isScrolling = true;
						}
	
						// It's a swipe!
						if (isScrolling === false){
							// stops browsers default behavior
							e.preventDefault();
	
							// this should be always 1px drag but on desktop chrome emulating touch it varies 1-3px, so I thought it's better to calculate the drag amount each touchmove
							dragSlide((touchCurrentX - touchStartX)-previousDrag);
							previousDrag = touchCurrentX - touchStartX;
						}
					}
				}, false);
	
				// END
				$slidesList[0].addEventListener("touchend", function(e) {
					// returns with transition
					$slidesList.removeClass("noTransitions");
					// if drag area bigger than swipeAmount then it's a proper swipe
					if (Math.abs(touchCurrentX - touchStartX) > plugin.settings.swipeAmount && touchCurrentX > 0) {
						// which direction should we go?
						if (touchCurrentX > touchStartX) {
							moveSlider('previous');
						} else {
							if (touchCurrentX < touchStartX) {
								moveSlider('next');
							}					
						}		
					} else {
						// not a swipe, just a preview. go back to original position
						$slidesList.css('-webkit-transform', 'translateX(' + originalPosition + 'px)'); // TODO other prefixes
					}
	
					// Resets vars
					touchStartX = 0;
					touchStartY = 0; 
					touchCurrentX = 0;
					touchCurrentY = 0;
					previousDrag = 0;
					isScrolling = "";
					intervalStart();
				}, false);	
			}


			/****************************************************
				EFFECTS SETUP 'theonering' AKA fade in and out
			*****************************************************/
			// Setting all <li> to be on top of each other :)
			if (plugin.settings.effects==="theonering") {
				$slideItem.each(function(index){
					$(this).css({
						"float"		: "none",
						"position"	: "absolute",
						"z-index"	: 1
					});
				});
			}



			/**************
				START UP
			***************/
			// Resize contents
			resizer();

			// removes transition (so the initial height does not animate)
			$slidesList.addClass("noTransitions");

			// shows slider according to effect selected
			if (plugin.settings.effects==="moonwalk"){				
				$slideItem.css({'opacity':1});
			} else {
				if (plugin.settings.effects==="theonering"){
					$($slideItem[currentSlide]).css({
						"z-index": 100,
						"opacity": 1
					});
					// Setting the UL to have the size of a LI
					$slidesList.css({
						"width"	: currentWidth,
						"height": $slideItem.height()
					});
					if ( $(".no-csstransitions").length ) {
						// IE9 and below: jQuery fadeOut
						$($slideItem).css("opacity", 1).not($slideItem[currentSlide]).fadeOut();
					}
				}
			}

			// back with transition
			$slidesList.removeClass("noTransitions");



			/****************
				AUTOPLAY
			*****************/
			// Autoplay Events (after it has been shown)
			if (plugin.settings.auto) {
					intervalStart();

				// Mouse over stops autoplay, mouse out restart
				$slidesList.hover(function() {
					intervalStop()
				}, function() {
					intervalStart();
				});
					
			}
		};
		
		/**********************
			FUNCTION intervalStart
		***********************/
		var intervalStart = function() {
			/* Old method */
			
			/*
			if (plugin.settings.auto) {
				slideInterval = setInterval(function(){
					moveSlider('next');
				}, plugin.settings.waitTime);
			}
			
			*/
			
			/* New method */
			if (plugin.settings.auto) {
				slideInterval = requestInterval(goToNext, plugin.settings.waitTime);
			}
		}
		
		/*************************
			FUNCTION intervalStop
		**************************/
		var intervalStop = function() {
			if (plugin.settings.auto) {
				clearRequestInterval(slideInterval);
			}
		}
		
		/*************************
			FUNCTION goToNext
		**************************/
		var goToNext = function() {
			moveSlider('next');
		}
	

		/**********************
			FUNCTION resizer
		***********************/
		var resizer = function(){
			// Removes transitions while resizing browser
			$slidesList.addClass("noTransitions");

			// Gets container width
			currentWidth = $container.width();

			// Sets all slides to be as big as container
			$slideItem.css({'width':currentWidth});

			// Except for the viewport which will be 1px less wide if container is an odd number
			if (currentWidth%2===1) {
				$slidesViewport.css({'width':currentWidth-1});	
			} else {
				$slidesViewport.css({'width':currentWidth});
			}

			// If effect is theonering then we need to reset dimensions of the UL (since all LI are position absolute)
			if (plugin.settings.effects==="theonering") {
				// updates dimensions
				$slidesList.css({
					"width"	: currentWidth,
					"height": $slideItem.height()
				});	
			}
			
			if (plugin.settings.effects==="moonwalk") {
				// Updates translate to match screen
				updateTranslateX();
			}
			
			if (plugin.settings.looping === "infinite") {
				// Update area dimensions
				visibleArea = $($slideItem).width();
				previewArea = (currentWidth-visibleArea)/2;
				
				//Reset width of previous & next buttons
				if (plugin.settings.navigation) {
					$(".vcslider-previous").width(previewArea -1);
					$(".vcslider-next").width(previewArea -3);
					
					//Add a new CSS class to cater for small screens
					if(previewArea <= 30) {
						$(".vcslider-previous").addClass('vcslider-compact');
						$(".vcslider-next").addClass('vcslider-compact');
					}
					else {
						$(".vcslider-previous").removeClass('vcslider-compact');
						$(".vcslider-next").removeClass('vcslider-compact');
					}
				}
				
				//Reset scrollbar position
				$slidesViewport.scrollLeft((visibleArea*3)-previewArea);
				currentPage = 2;
			}

			// Get back the transition property
			$slidesList.removeClass("noTransitions");
		};



		/*******************************
			FUNCTION updateTranslateX
		********************************/
		// For "moonwalk", updates css property setting the position of the slider
		var updateTranslateX = function() {
			setCssTransformTranslate(currentSlide*currentWidth*(-1));
		};



		/***************************
			FUNCTION updateStatus
		****************************/
		// Updates value of status bar
		var updateStatus = function(){
			slidesStatus.html((currentSlide+1) + " of " + slidesCounter);
		};



		/************************
			FUNCTION dragSlide
		*************************/
		// drags slide, like a preview when swiping
		var dragSlide = function(amount) {
			var isFirstSlideGoingForward = false,
				isLastSlideGoingBackward = false,
				isMiddleSlide = false;

			// Update vars
			if (currentSlide === 0 && amount < 0) {
				isFirstSlideGoingForward = true;
			}
			if (currentSlide === slidesCounter-1 && amount > 0) {
				isLastSlideGoingBackward = true;
			}
			if (currentSlide !== 0 && currentSlide !== slidesCounter-1) {
				isMiddleSlide =  true;
			}
			
			// test to avoid preview when there is no next/previous slides (first and last)
			if (isFirstSlideGoingForward || isLastSlideGoingBackward || isMiddleSlide){
				var currentPosition = getCssTransformTranslate(),
					dragVal = amount + currentPosition;
				// updates css
				setCssTransformTranslate(dragVal);
			}
		};



		/*************************
			FUNCTION moveSlider
		**************************/
		// Go to next or previous slide
		var moveSlider = function(destination){
			var previousSlide = currentSlide;

			// Translates next/previous to actual slide number
			if ( destination === 'next' ) {
				currentSlide = currentSlide + 1;
			} else {
				if ( destination === 'previous' ) {
					currentSlide = currentSlide - 1;
				} else {
					// User clicked on label link
					currentSlide = destination;
				}
			}
			
			// Manages Looping option
			// JUMP: when on last slide, jumps to first (and vice-versa)
			if (plugin.settings.looping==="jump"){
				// Last slide and user clicked next -> go to first
				if (currentSlide > slidesCounter-1) {
					currentSlide = 0;
				} else {
					// First slide and user clicked previous -> go to last
					if (currentSlide < 0) {
						currentSlide = slidesCounter-1;
					} 
				}
			} else {
				if (plugin.settings.looping==="stop"){
					// STOP: does nothing when reaching edges of slide list				
					if ( (currentSlide > slidesCounter-1) || (currentSlide < 0) ) {
						currentSlide = previousSlide;	
					} 
				} else {
					if (plugin.settings.looping === "infinite"){
						// INFINITE: never ending loop
						
						// We're moving back!
						if (destination === 'previous') {
							$($slidesViewport).animate({scrollLeft : '-=' + visibleArea}, 400, function() {
								// If we're on the first page, reset the scollLeft value
								currentPage = currentPage - 1;
								if(currentPage <= 0) {
									$slidesViewport.scrollLeft((visibleArea*(uniqueSlides+1))-previewArea);
									currentPage = uniqueSlides;
								}
							});
							
							// First slide and user clicked previous -> go to last	
							if (currentSlide < 0) {
								currentSlide = uniqueSlides-1;
							}
						}
						// We're going forward!
						else {
							$($slidesViewport).animate({scrollLeft : '+=' + visibleArea}, 400, function() {
								// If we're on the last page, reset the scollLeft value
								currentPage = currentPage + 1;
								if(currentPage > uniqueSlides+1) {
									$slidesViewport.scrollLeft((visibleArea*3)-previewArea);
									currentPage = 2;
									currentSlide = 0;
								}

							});
														
							// When we get to the end, reset the current slide counter
							if(currentSlide === uniqueSlides) {
								currentSlide = 0;
							}
						}						
					}
				}
			}

			// Manages Effect option
			if (plugin.settings.effects === "moonwalk") {
				// For IE9 and below: jQuery animate
				if ( $(".no-csstransitions").length ) {
					$slidesList.animate({left: currentSlide*currentWidth*(-1)}, 500);
				} else {
					// Move based on the new currentSlide value
					updateTranslateX();
				}				
			} else {
				if (plugin.settings.effects === "theonering" && previousSlide !== currentSlide) {
					// only applies if slide actually changed
					if ( $(".no-csstransitions").length ) {
						// IE9 and below: jQuery fadeIn/Out
						$($slideItem[currentSlide]).fadeIn();
						$($slideItem[previousSlide]).fadeOut();
					} else {
						$($slideItem[currentSlide]).css({
							"z-index": 100,
							"opacity": 1
						});
						$($slideItem[previousSlide]).css({
							"z-index": 1,
							"opacity": 0
						});
					}
				}
			}
			
			// Updates Status
			if (plugin.settings.showStatus && (previousSlide !== currentSlide)) {
				updateStatus();
			}

			// Updates Label links
			if (plugin.settings.labelLinks && (previousSlide !== currentSlide)) {
				updateLabelLinks();
			}
		};



		/*******************************
			FUNCTION updateLabelLinks
		********************************/
		// Update label link bar to highlight current slide
		var updateLabelLinks = function() {
			$container.find("li[data-vcslider-frame]").removeClass("selected");
			$container.find("li[data-vcslider-frame="+ currentSlide +"]").addClass("selected");
		};		



		/***************************************
			FUNCTION setCssTransformTranslate
		****************************************/
		// Update CSS: Transform Translate for slidesList
		var setCssTransformTranslate = function ( value ){
			var cssValue = 'translateX(' + value + 'px)';

			$slidesList.css({
				'-webkit-transform':	cssValue,
				'transform':			cssValue
			});
		};



		/***************************************
			FUNCTION getCssTransformTranslate
		****************************************/
		// Get CSS: Transform Translate for slidesList
		var getCssTransformTranslate = function (){
			return parseInt($slidesList.css("-webkit-transform").substr(7, $slidesList.css("-webkit-transform").length - 8).split(', ')[4], 10);
			/*var moz = parseInt(slidesList.css("-moz-transform").substr(7, slidesList.css("-moz-transform").length - 8).split(', ')[4], 10),
				webkit = parseInt(slidesList.css("-webkit-transform").substr(7, slidesList.css("-webkit-transform").length - 8).split(', ')[4], 10),
				ms = parseInt(slidesList.css("-ms-transform").substr(7, slidesList.css("-ms-transform").length - 8).split(', ')[4], 10),
				cssthree = parseInt(slidesList.css("transform").substr(7, slidesList.css("transform").length - 8).split(', ')[4], 10);

			console.log("moz: " + moz + "/ webkit: " + webkit + "/ ms: " + ms + "/ css3: " + cssthree);*/

			// TODO: other prefixes
		};

		/****************
			INITIALIZE
		*****************/
		init();
			
	};

}) ( jQuery );



/*
*	TODO list for V2:
*   - Browser test
*	- Infinite loop: endless carousel
*/