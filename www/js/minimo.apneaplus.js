param_mainBlocker_opacity = '0.6';
param_navigation_width = '200px';

fadeIn = function (obj, opacity) {
    if (opacity == undefined) {
        opacity = '1';
    }
    s(obj).visibility = 'visible';
    s(obj).opacity = opacity;
} // fadeIn

fadeOut = function (object, timeout) {
    s(object).opacity = '0';
    setTimeout(function () {
        s(object).visibility = 'hidden';
    }, timeout)
} // fadeOut

modHeader = function (i) {
    switch (i) {
        case 'show':
            log('Navigation open');

            s('main-header').height = '100%';
            s('main-header').backgroundColor = '#362600';
            s('main-header').backgroundSize = '70px';
            s('main-header').backgroundPosition = 'left 10px';

            if (window.cordova && StatusBar) {
                StatusBar.backgroundColorByHexString('#362600');
            }
            break;
        case 'hide':
            log('Navigation closed');
            s('main-header').height = '70px';

            s('main-header').backgroundColor = '#b27c00';
            s('main-header').backgroundSize = '100px';
            s('main-header').backgroundPosition = 'right 10px';

            if (window.cordova && StatusBar) {
                StatusBar.backgroundColorByHexString('#b27c00');
            }
            break;
    }
} // modHeader

modSubheader = function (i) {
    switch (i) {
        case 'show':
            s('main-subheader').height = '50px';
            break;
        case 'hide':
            s('main-subheader').height = '0px';
            break;
    }
} // modSubheader

modNavigation = function (i) {
    switch (i) {
        case 'show':
            // log('Navigation open');
            s('navigation').width = param_navigation_width;
            s('main-container').left = '100px';
            fadeIn('main-blocker', param_mainBlocker_opacity);
            o('main-blocker').addEventListener('click', function () {
                modNavigation('hide')
            })
            break;
        case 'hide':
            // log('Navigation closed');
            s('navigation').width = '0px';
            s('main-container').left = '0px';
            fadeOut('main-blocker', 300)
            o('main-blocker').removeEventListener('click', false);
            break;
    }
} // modNavigation

onConfirm = function (buttonIndex) {
    switch (buttonIndex) {
        case 1:
            alert('1');
            break;
        case 2:
            alert('2');
            break;
    }
} // onConfirm

pageStatic = function () {
    // subHeader('show');
    page.go(1);
} // pageStatic

pageLog = function () {
    // subHeader('hide');
    page.go(2);
} // pageLog

pagePlaces = function () {
    testNotif();
} // pagePlaces

hashListener = function () {
    (location.hash === "#static") && pageStatic();
    (location.hash === "#log") && pageLog();
    (location.hash === "#places") && pagePlaces();
} // hashListener

swiper = function (state) {
    switch (state) {
        case 'left':
            modNavigation('hide');
            break;
        case 'right':
            modNavigation('show');
            break;
        case 'down':
            modHeader('show');
            break;
        case 'up':
            modHeader('hide');
            break;
    }
} // swiper extend

testNotif = function () {
    var now = new Date().getTime(),
        _5_sec_from_now = new Date(now + 5 * 1000);

    var sound = "file://notification.mp3";

    if (window.cordova) {
        cordova.plugins.notification.local.schedule({
            id: 1,
            title: 'Apnea+',
            text: 'Dont forget to train today ...',
            at: _5_sec_from_now,
            sound: sound,
            badge: 1,
            data: {
                "username": "Novan"
            }
        })
    } else {
        log('Simulating notification ...')
    }

}; // test notification

init = function () {
    window.addEventListener("hashchange", hashListener);
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    document.addEventListener('touchend', handleTouchEnd, false);
    document.addEventListener('oncontextmenu', function(){return false;});
    
    // enabling fastclick
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body);
    }, false);
    
    
    log('Initialized');
    
    minimo = null;
    
    load({
        url: 'config.json',
        loaded: function (res) {
            var minimo = JSON.parse(res);

            log("app : " + minimo['app_name']);
            log("version : " + minimo['version']);
        }
    }); // load

    s('main-header').height = '70px';
    s('main-subheader').height = '50px';

    page = new Page('main-page');

    hashListener(); // select page from hash


    document.addEventListener('deviceready', function () {
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if (window.cordova && StatusBar) {
            StatusBar.backgroundColorByHexString('#b27c00');
        }

        cordova.plugins.notification.local.on("click", function (notification) {

            var user = JSON.parse(notification.data);

            navigator.notification.confirm(
                'Hello ' + user['username'] + ', Category selected ' + notification.id, // message
                onConfirm, // callback to invoke with index of button pressed
                'Saving data', // title
                ['Ok', 'Cancel'] // buttonLabels
            );
        });

        // monitor hash

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    });
} // initialize application


// EVENT LISTENER

window.addEventListener("load", init);

