/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function(document, window) {
    
    /*
     * SOME GLOBL AND MAGIG VARS
     */
    
    var SLIDE_TIMEOUT = 1000;
    
    var isSupported = function() {
        
    };
    
    var byId = function(parent, id) {
        return parent.getElementById(id);
    };
    var byClassName = function(parent, className) {
        return parent.getElementsByClassName(className);
    };
    var getCurrentHash = function() {
        var url = window.location.href;
        var hashIndex = url.indexOf('#');
        return (hashIndex > -1) ? url.slice(hashIndex+1, url.length) : null;
    };
    var setHash = function(newHash) {
        var url = window.location.href;
        var hashIndex = url.indexOf('#');
        
        if (hashIndex > -1) {
            url = url.slice(0, hashIndex);
        }
        url += "#"+newHash;
        window.location.href = url;
    };
    var addClass = function(element, className) {
        if (element.classList) {
            element.classList.add(className);
        }
        else {
            element.className += className;
        }
    };
    var removeClass = function(element, className) {
        if (element.classList) {
            element.classList.remove(className);
        }
        else {
            element.className -= className;
        }
    };
    var Timeout = function(exec, time) {
        setTimeout(exec, time);
    };
    var isNumeric = function(input) {
        return typeof input === 'number' && isFinite(input);
    };
    
    var jspresLib = window.jspresLib = function (rootContainerId) {
        
        var rootContainer = null;
        var slides = null;
        var slidesNames = {};

        var currentSlidesState = { active: null, enter: null, leave: null };
        var active = null;
        var activeStep = null;
        
        var init = function() {
            rootContainer = byId(document, rootContainerId);
            var slidesContainer = byClassName(rootContainer, 'slides')[0];
            slides = byClassName(slidesContainer, 'slide');
            
            // Init steps of the slides
            for (var slideIndex in slides) {
                if (typeof (slides[slideIndex]).innerHTML === "string") {
                    var currentSlide = slides[slideIndex];
                    var steps = byClassName(currentSlide, 'step');
                    currentSlide.steps = steps;
                }
            }
            
            
            // Make a object which contains the names of the slides and when we 
            // speciffy the slide id the jspres-lib knows where to go
            for (var currentSlideId in slides) {
                //slidesNames[currentSlideId] = slides[currentSlideId].id;
                var slideName = slides[currentSlideId].id;
                if (!slideName) {
                    slideName = 'slide-'+currentSlideId;
                    //slides[currentSlideId].id = 'slide-'+currentSlideId;
                }
                slidesNames[slideName] = currentSlideId;
                slidesNames[currentSlideId] = slideName;
            }
            
            var currentSlideHash = getCurrentHash();
            if (currentSlideHash != null) {
                gotoSlide(currentSlideHash);
            }
            else {
                gotoSlide(0);
            }
            
            displayInfo();
        };
        
        var displayInfo = function() {
            var infoContainer = document.createElement('div');
            infoContainer.className = 'jspres-info';
            infoContainer.innerHTML = "To navigate use the spacebar or arrow keys. <br />\
                If you are on a touch device tap the screen edges;";
            
            if (rootContainer) {
                rootContainer.appendChild(infoContainer);
                Timeout(function() {
                    addClass(infoContainer, 'hide');
                }, 5000);
            }
        };
        
        var getSlide = function(slideId) {
            if (!slideId) 
                slideId = 0;
            
            var slideName = slideId;
            if (!isNumeric(slideId)) {
                slideId = slidesNames[slideId];
            }
            else {
                var slideName = slidesNames[slideId];
            }

            if (slideId === undefined)
                return getSlide(0);
            
            return { name: slideName, id: parseInt(slideId) };
        };
        var leaveSlide = function(time) {           
            var leave = null;
            if (currentSlidesState.enter)
                leave = currentSlidesState.enter;
            else if (currentSlidesState.active)
                leave = currentSlidesState.active;
            
            if (leave) {
                currentSlidesState.leave = leave;
                
                removeClass(leave, 'active');
                addClass(leave, 'leave');
                addClass(leave, leave.getAttribute('data-leave'));
                
                Timeout(function() {
                    removeClass(leave, 'leave');
                    removeClass(leave, leave.getAttribute('data-leave'));
                    
                    // Leave all stepps of the slide
                    for (var stepIndex in leave.steps) {
                        if (typeof (leave.steps[stepIndex]).innerHTML === "string") {
                            removeClass(leave.steps[stepIndex], 'active');    
                        }
                    }
                    leave.lastStep = -1;
                    
                    currentSlidesState.leave = null;
                }, SLIDE_TIMEOUT);
            }
        };
        var leaveStep = function(slide, stepId) {
            var leave = slide.steps[stepId];
            
            removeClass(leave, 'active');
            removeClass(leave, 'enter');
            
            addClass(leave, 'leave');
            addClass(leave, leave.getAttribute('data-leave'));
            slide.lastStep = stepId-1;

            Timeout(function() {
                removeClass(leave, 'leave');
                removeClass(leave, leave.getAttribute('data-leave'));
            }, SLIDE_TIMEOUT);
        };
        var enterSlide = function(slideDetails) {
            currentSlidesState.active = null;
            currentSlidesState.enter = slides[slideDetails.id];
            currentSlidesState.enter.slideDetails = slideDetails;
            
            var enter = currentSlidesState.enter;
            
            addClass(enter, 'enter');
            addClass(enter, enter.getAttribute('data-enter'));

            Timeout(function() {
                removeClass(enter, 'enter');
                removeClass(enter, enter.getAttribute('data-enter'));

                if (currentSlidesState.enter != null && currentSlidesState.enter.slideDetails.id == active.id) {
                    addClass(enter, 'active');
                    currentSlidesState.active = enter;
                    if (enter.slideDetails)
                        setHash(enter.slideDetails.name);
                }
                currentSlidesState.enter = null;
            }, SLIDE_TIMEOUT);
        };
        var enterStep = function(slide, stepId) {
            var enter = slide.steps[stepId];
            if (enter.className.indexOf('active') > -1)
                return;
            
            addClass(enter, 'enter');
            addClass(enter, enter.getAttribute('data-enter'));
            
            Timeout(function() {
                removeClass(enter, 'enter');
                removeClass(enter, enter.getAttribute('data-enter'));

                if (currentSlidesState['active'] && currentSlidesState['active'].lastStep >= stepId)
                    addClass(enter, 'active');

            }, SLIDE_TIMEOUT);
        };
        
        var gotoSlide = function(slideId) {        
            var slideDetails = getSlide(slideId);
            
            if (slideDetails) {
            
                leaveSlide();
                active = slideDetails;
                enterSlide(slideDetails);
            }
        };
        var gotoStep = function(stepId) {
            var slideType = null;
            if (currentSlidesState.enter)
                slideType = 'enter';
            else if (currentSlidesState.active)
                slideType = 'active';
            
            currentSlidesState[slideType].lastStep = stepId;
            enterStep(currentSlidesState[slideType], stepId);
        };
        
        var next = function() {
            if (currentSlidesState.enter)
                var type = 'enter';
            else if (currentSlidesState.active)
                var type = 'active';

            if (type == 'active') {
                var steps = currentSlidesState[type].steps;
                if (steps.length > 0) {
                    var nextStepId = (currentSlidesState[type].lastStep != undefined) ? (currentSlidesState[type].lastStep + 1) : 0;
                    if (nextStepId < steps.length) {
                        gotoStep(nextStepId);
                        return;
                    }
                }
            }
            var nextSlideId = currentSlidesState[type].slideDetails.id + 1;            
            if (nextSlideId == slides.length)
                nextSlideId = 0;

            gotoSlide(nextSlideId);
        };
        var prev = function() {
            if (currentSlidesState.enter)
                var type = 'enter';
            else if (currentSlidesState.active)
                var type = 'active';

            if (type == 'active') {
                var steps = currentSlidesState[type].steps;
                if (steps.length > 0) {
                    var lastStepId = (currentSlidesState[type].lastStep != undefined) ? (currentSlidesState[type].lastStep) : -1;
                    if (lastStepId >= 0) {
                        console.log('Go back');
                        leaveStep(currentSlidesState[type], lastStepId);
                        return;
                    }
                }
            }

            var prevSlideId = currentSlidesState[type].slideDetails.id - 1;            
            if (prevSlideId == -1)
                prevSlideId = slides.length-1;

            gotoSlide(prevSlideId);
        };
        
        // Navigation events
        // For the users on devices with keyboard
        document.addEventListener('keyup', function(event) {
            switch (event.keyCode) {
                case 32: // space
                case 39: // right arrow
                case 40: // down arrow
                    next();
                    break;
                case 37: // left arrow
                case 38: // up arrow
                    prev();
                    break;
            }
        }, false);
        
        // For the moderns users with touch devices
        document.addEventListener("touchstart", function (event) {
            if (event.touches.length === 1) {
                var touchX = event.touches[0].clientX;
                var deviceWidth = window.innerWidth;
                var tolerance = deviceWidth / 5;
                
                if (touchX < tolerance) {
                    prev();
                    event.preventDefault();
                } else if ( touchX > deviceWidth - tolerance) {
                    next();
                    event.preventDefault();
                }
            }
        }, false);
        
        return ({
            init: init,
            gotoSlide: gotoSlide,
            next: next,
            prev: prev
        });
    };
    
})(document, window);



