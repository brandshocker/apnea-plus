param_mainBlocker_opacity = '0.6';
param_navigation_width = '200px';

hashListener = function () {
    (location.hash === "#static") && pageStatic();
    (location.hash === "#log") && pageLog();
    (location.hash === "#places") && pagePlaces();
} // hashListener

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

Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function (key) {
    return JSON.parse(this.getItem(key));
}

Notification = function (id,title,text,data) {
    var now = new Date().getTime(),
        now = new Date(now);

    var sound = "file://notification.mp3";

    if (window.cordova) {
        cordova.plugins.notification.local.schedule({
            id: id,
            title: 'Apnea+',
            text: text,
            at: now,
            sound: sound,
            badge: 1,
            data: data
        })
    } else {
        log('Simulating notification ...')
    }

}; // test notification

INIT = function () {
    log('Initialized');
    log("app : " + minimo.appName);
    log("version : " + minimo.version);

    window.addEventListener("hashchange", hashListener);
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    document.addEventListener('touchend', handleTouchEnd, false);

    // enabling fastclick
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body);
    }, false);

    s('main-header').height = '70px';
    s('main-subheader').height = '50px';

    page = new Page('main-page');

    hashListener(); // select page from hash

    setInterval(function () {
        load({
            url: minimo.API + 'minimo_notification.php?user_id=1',
            loaded: function (res) {
                var msg = JSON.parse(res);
                for(var i = 0; i < msg.length; i++){
                    Notification(msg[i].id,minimo.appName, msg[i].message,'{}')
                }
            }
        }); // load
    }, 30000);

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

        // Check Notification

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    });

} // initialize application


// EVENT LISTENER

load({
    url: 'config.json',
    loaded: function (res) {
        minimo = JSON.parse(res);
        window.addEventListener("load", INIT);
    }
}); // load
