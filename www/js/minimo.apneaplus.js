modHeader = function (i) {
    switch (i) {
        case 'show':
            log('Navigation open');
            StatusBar.backgroundColorByHexString('#362600');
            s('main-header').height = '100%';
            s('main-header').backgroundColor = '#362600';
            s('main-header').backgroundSize = '70px';
            break;
        case 'hide':
            log('Navigation closed');
            s('main-header').height = '70px';
            StatusBar.backgroundColorByHexString('#b27c00');
            s('main-header').backgroundColor = '#b27c00';
            s('main-header').backgroundSize = '100px';
            break;
    }
}

modNavigation = function (i) {
    switch (i) {
        case 'show':
            log('Navigation open');
            s('navigation').width = '200px';
            s('main-container').left = '200px';
            break;
        case 'hide':
            log('Navigation closed');
            s('navigation').width = '0px';
            s('main-container').left = '0px';
            break;
    }
}

onConfirm = function (buttonIndex) {
    switch (buttonIndex) {
        case 1:
            alert('1');
            break;
        case 2:
            alert('2');
            break;
    }
}

pageStatic = function () {
    subHeader('show');
}

pageLog = function () {
    subHeader('hide');
}

pagePlaces = function () {
    testNotif();
}

pageSelector = function () {
    (location.hash === "#static") && pageStatic();
    (location.hash === "#log") && pageLog();
    (location.hash === "#places") && pagePlaces();
}

subHeader = function (i) {
    switch (i) {
        case 'show':
            s('main-subheader').height = '50px';
            break;
        case 'hide':
            s('main-subheader').height = '0px';
            break;
    }
}

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
}

testNotif = function () {
    var now = new Date().getTime(),
        _5_sec_from_now = new Date(now + 5 * 1000);

    var sound = "file://notification.mp3";

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
};

init = function () {
    log('Initialized');

    s('main-header').height = '70px';
    s('main-subheader').height = '50px';

    pageSelector();
}


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

// EVENT LISTENER
window.addEventListener("hashchange", pageSelector);
window.addEventListener("load", init);
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
document.addEventListener('touchend', handleTouchEnd, false);
