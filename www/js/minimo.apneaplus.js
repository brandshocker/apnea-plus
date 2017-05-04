        document.addEventListener('deviceready', function () {
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            cordova.plugins.notification.local.on("click", function (notification) {
                navigator.notification.confirm(
                    'Hello ' + notification.data['username'] + ', Category selected ' + notification.id, // message
                    onConfirm, // callback to invoke with index of button pressed
                    'Saving data', // title
                    ['Ok', 'Cancel'] // buttonLabels
                );
            });

            function onConfirm(buttonIndex) {
                switch(buttonIndex){
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
                        username: "Novan"
                    }
                })
            };
            
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        });
