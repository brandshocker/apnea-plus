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

init = function()
{
    log('Initialized');
    
    o('main-header').style.height = '70px';
    o('main-subheader').style.height = '50px';
}


document.addEventListener('deviceready', function () {
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    StatusBar.backgroundColorByHexString('#b27c00');

    cordova.plugins.notification.local.on("click", function (notification) {

        var user = JSON.parse(notification.data);
        navigator.notification.confirm(
            'Hello ' + user['username'] + ', Category selected ' + notification.id, // message
            onConfirm, // callback to invoke with index of button pressed
            'Saving data', // title
                    ['Ok', 'Cancel'] // buttonLabels
        );
    });

    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});
