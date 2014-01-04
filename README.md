jspres-lib
==========

A JSpres-lib is a framework for simple and flat presentations

# HOW TO USE IT
You can see our examples for better use of the code but you can read here what the lib contains and how to use it

## Slides
To define s slide element you just need to add `slide` class attribute to the needed element.

**See how**

    <div class="slide">
        <div class="title">Hello world!</div>
        <div class="sub-title">jspres-lib is here</div>
    </div>

## Transitions
To use a transition you just need to add the `data-enter` and `data-leave` attributes to your slide HTML element and jspres-lib will know what you want.

**See how**

    <!-- Attributes are not defined. Default fadeIn and fadeOut will be used -->
    <div class="slide"></div>
    
    <!-- data-enter attribute is defined. Default leave transition will be used. -->
    <div class="slide" data-enter="fadeIn"></div>
    
    <!-- data-enter and data-leave attributes are defined. This transitions will be used -->
    <div class="slide" data-enter="enterSlideRight" data-leave="leaveSlideLeft"></div>

### Available transitions

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

# EXAMPLES
Still don't have

# THEMES

# VERSIONS HISTORY

### 0.1 ([browse](http://github.com/bartaz/impress.js/tree/0.1), [download zip](http://github.com/bartaz/impress.js/zipball/0.1)) - 04 January 2013

First beta release.

The beta release is for test. It contains the most basic transitions for changing the slides (fading, zooming and sliding from the edges), a few content containers and three themes (default-theme, dark-theme, rainbow-theme).

# LICENSE

Copyright 2014 Valentin Kirilov

Released under the MIT License.
