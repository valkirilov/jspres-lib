/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


(function(document, window) {
    
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
        var currentSlide = null;
        var isChanging = { value: false, enterTimeout: null, leaveTimeout: null };
        
        var init = function() {
            rootContainer = byId(document, rootContainerId);
            var slidesContainer = byClassName(rootContainer, 'slides')[0];
            slides = byClassName(slidesContainer, 'slide');
            
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
                console.log('Try to go to ' + currentSlideHash);
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
            return { name: slideName, id: parseInt(slideId) };
        };
        var leaveSlide = function(time) {
            if (currentSlide) {
                var leavingSlide = currentSlide;
                
                removeClass(leavingSlide, 'active');
                addClass(leavingSlide, 'leave');
                addClass(currentSlide, leavingSlide.getAttribute('data-leave'));
                
                isChanging.enterTimeout = Timeout(function() {
                    removeClass(leavingSlide, 'leave');
                    removeClass(leavingSlide, leavingSlide.getAttribute('data-leave'));
                    isChanging.enterTimeout = null;
                }, time);
            }
        };
        var enterSlide = function(time, slide) {
            addClass(currentSlide, 'enter');
            addClass(currentSlide, currentSlide.getAttribute('data-enter'));
            
            isChanging.leaveTimeout = Timeout(function() {
                removeClass(currentSlide, 'enter');
                removeClass(currentSlide, currentSlide.getAttribute('data-enter'));
                addClass(currentSlide, 'active');
                if (slide)
                    setHash(slide.name);
                
                isChanging = false;
                isChanging.leaveTimeout = null;
            }, time);
        };
        
        var gotoSlide = function(slideId) {
            console.log('Goto: ' + slideId);
            
            if (isChanging.value) {
                alert('Changing');
                leaveSlide(0);
                enterSlide(0);
                
                clearTimeout(isChanging.enterTimeout);
                clearTimeout(isChanging.leaveTimeout);
            }
            isChanging.value = true;
            
            
            
            // First we have to hide the current vissible slide and we are adding
            // a `leave` class to it and removing the `active state`
            var slide = getSlide(slideId);
            leaveSlide(1010);
            
            // Then we have to change the current slide with the new one and make
            // it vissible with `enter` animation
            currentSlide = slides[slide.id];
            
            // Add enter class and the animation attribute that is provided
            enterSlide(1010, slide);
        };
        
        var next = function() {
            console.log('Next slide');
            var currHash = getCurrentHash();
            var currSlide = getSlide(currHash);
            console.log(currSlide);
            console.log('Go to 0: ' + currSlide.id);
            if (currSlide.id == slides.length-1) {
                
                gotoSlide(0);
            }
            else {
                gotoSlide(currSlide.id+1);
            }
        };
        var prev = function() {
            console.log('Prev');
            var currHash = getCurrentHash();
            var currSlide = getSlide(currHash);
            console.log(currSlide);
            if (currSlide.id == 0) {
                gotoSlide(slides.length-1);
            }
            else {
                gotoSlide(currSlide.id-1);
            }
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
                var tolerance = deviceWidth / 10;
                
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



