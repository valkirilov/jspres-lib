jspres-lib
==========

A JSpres-lib is a framework for simple and flat presentations

#Table of contents
==================
- [How to use it](#HOW TO USE IT)
    - [Slides](#Slides)
    - [Steps](#Steps)
    - [Transitions](#Transitions)
- [Examples](#EXAMPLES)
- [Themes](#THEMES)
- [Vesrions](#VERSIONS)


#HOW TO USE IT
You can see our examples for better use of the code but you can read here what the lib contains and how to use it

##Slides
To define s slide element you just need to add `slide` class attribute to the needed element.

**See how**

    <div class="slide">
        <div class="title">Hello world!</div>
        <div class="sub-title">jspres-lib is here</div>
    </div>
    
##Steps
You can make steps in your slides or said with different word you can show additional information on every slide instead of moving to the next slide. To do this you only have to add `step` to the class attribute of the element that you want to make a step.

**See how**
    
    <!-- h2 and the content will be steps in this slide -->
    <div class="slide">
        <div class="h1">Hello world!</div>
        <div class="h2 step">jspres-lib is here</div>
        <div class="content step">Another step</div>
    </div>
    

##Transitions
To use a transition you just need to add the `data-enter` and `data-leave` attributes to your slide HTML element and jspres-lib will know what you want.

**See how**

    <!-- Attributes are not defined. Default fadeIn and fadeOut will be used -->
    <div class="slide"></div>
    
    <!-- data-enter attribute is defined. Default leave transition will be used. -->
    <div class="slide" data-enter="fadeIn"></div>
    
    <!-- data-enter and data-leave attributes are defined. This transitions will be used -->
    <div class="slide" data-enter="enterSlideRight" data-leave="leaveSlideLeft"></div>

###Available transitions

**Default transitions**
- `fadeIn`
- `fadeOut`

**Enter transitions**
- `enterSlideTop`
- `enterSlideRight`
- `enterSlideBottom`
- `enterSlideLeft`
- `enterZoomIn`
- `enterZoomOut`

**Leave transitions**
- `leaveSlideTop`
- `leaveSlideRight`
- `leaveSlideBottom`
- `leaveSlideLeft`
- `leaveZoomIn`
- `leaveZoomOut`

There are a few available transitions for now and you can contribure more.

#EXAMPLES
Still don't have

#THEMES

#VERSIONS HISTORY

### 0.1 ([browse](), [download zip]()) - 04 January 2013

First beta release.

The beta release is for test. It contains the most basic transitions for changing the slides (fading, zooming and sliding from the edges), a few content containers and three themes (default-theme, dark-theme, rainbow-theme).

# LICENSE

Copyright 2014 Valentin Kirilov

Released under the MIT License.
