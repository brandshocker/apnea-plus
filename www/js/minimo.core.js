// MINIMO CORE 1.1
mimo = {
    version : '1.0.0',
    debug : true,
    developer : 'Minimo Labs'
}

log = function (i) {
    if(mimo.debug){
        console.log(i);
    }
}

o = function (id) {
    return document.getElementById(id);
}

c = function (classname) {
    return document.getElementsByClassName(classname);
}; // function c 

s = function (id) {
    return o(id).style;
}

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

Get = function(v) {
    return localStorage.getItem(v);
}; // function Get 

load = function (obj) {
    var url = obj['url'];
    var loaded = obj['loaded'];
    var data = obj['data'];
    var type = obj['type'];

    if (data == undefined) {
        data = "";
    } else {
        data = "?" + data;
    }

    if (type == undefined) {
        type = 'GET';
    }

    var xObj = new XMLHttpRequest();
    xObj.open(type, url + data, true);
    xObj.onreadystatechange = function () {
        if (xObj.readyState == 4 && xObj.status == 200) {
            loaded(xObj.responseText);
        } else {
            var error = obj['error'];
            if (typeof error === 'function') {
                error();
            }
        }
    };
    xObj.send(null);
}; // function load

Page = function (ID) {
    this.PAGE = 1;
    this.ID = ID;
    this.count = o(ID).children.length;
    this.PAGEWIDTH = 100 / this.count;
    this.MAX = this.count;

    //alert(window.innerWidth);
    


    s(this.ID).width = (this.count * 100) + '%';
    s(this.ID).position = "absolute";

    var x = c(ID);
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].style.width = 'calc(100% / ' + this.count + ')';
        x[i].style.float = 'left';
        x[i].style.overflow = 'visible';
    }

    this.next = function () {
        if(this.PAGE == this.MAX){
            log('last page');
            this.go(this.PAGE);
        } else {
            this.go(this.PAGE + 1);
        }
    }

    this.prev = function () {
        if(this.PAGE == 1){
            log('first page');
            this.go(this.PAGE);
        } else {
            this.go(this.PAGE - 1);
        }
    }

    this.go = function (page) {
        this.SEL = page - 1;
        switch (this.SEL) {
            case 0:
                s(this.ID).transform = "translate3d(0%,0,0)";
                break;
            default:
                //s(this.ID).left = '-' + this.SEL * 100 + '%';
                s(this.ID).transform = "translate3d(-" + (this.SEL * this.PAGEWIDTH) + "%,0,0)";
                break;
        }
        
        this.PAGE = page;
    }

    touchStart = function(e) {
        
        this.initX = e.touches[0].clientX;
        this.initY = e.touches[0].clientY;
        s(page.ID).transition = '0s';
        this.state = null;
    }

    touchMove = function (e) {
        this.x = e.touches[0].clientX;
        this.y = e.touches[0].clientY;
        this.diff = this.x - this.initX;
        this.yDiff = this.y - this.initY;
        if (this.state == null) {
            if (Math.abs(this.diff) > Math.abs(this.yDiff)) {
                this.state = 'hor';
            } else {
                this.state = 'ver';
            }
        }
        
        if (this.initX < 20) {
            return;
        } else {
            this.coor = "Coordinates: (" + this.x + "," + this.y + ")";
            //s(this.ID).transform = "translate3d("(this.x - this.initX) + "%,0,0)";
            if (page.PAGE == 1) {
                if (this.diff >= 30) {
                    this.diff = 30;
                }
            }

            if (page.PAGE == page.MAX) {
                if (this.diff <= -30) {
                    this.diff = -30;
                }
            }

            this.to = -((page.PAGE - 1) * page.PAGEWIDTH) + (this.diff / window.innerWidth) * page.PAGEWIDTH;
            
            if(this.state == 'hor'){
                e.preventDefault();
                s(ID).transform = "translate3d(" + this.to + "%,0,0)";
            }         
        }
    }
    
    touchEnd = function (e) {
        if (this.state == 'hor') {
            if (this.initX > 30) {
                if (this.diff >= -70 && this.diff <= 70) {
                    page.go(page.PAGE);
                } else {
                    if (this.diff > 0) {
                        page.prev();
                    } else {
                        page.next();
                    }
                }
            }
        }
        
        s(page.ID).transition = '0.2s';

        this.state = null;
        this.diff = null;
        this.yDiff = null;
    }

    o(ID).addEventListener("touchstart", function (event) {
        touchStart(event);
    });

    o(ID).addEventListener("touchmove", function (event) {
        touchMove(event);
    });
    
    o(ID).addEventListener("touchend", function () {
        touchEnd();
    });
    
    o(ID).addEventListener("touchcancel", function () {
        touchEnd();
    });

} // page constructors

Set = function(v, al) {
    localStorage.setItem(v, al);
}; // function set 



// SWIPER NEED_CLEEN

let xDown = null;
let yDown = null;
let xDiff = null;
let yDiff = null;
let timeDown = null;
const TIME_TRASHOLD = 400;
const DIFF_TRASHOLD = 130;

const SWIPE_BLOCK_ELEMS = [
  'swipeBlock',
  'handle',
  'drag-ruble'
]

handleTouchEnd = function () {

    let timeDiff = Date.now() - timeDown;
    if (Math.abs(xDiff) > Math.abs(yDiff)) { /*most significant*/
        if (Math.abs(xDiff) > DIFF_TRASHOLD && timeDiff < TIME_TRASHOLD) {
            if (xDiff > 0) {
                // console.log(xDiff, TIME_TRASHOLD, DIFF_TRASHOLD)
                swiper('left');
            } else {
                // console.log(xDiff)
                if(xDown < 20){
                    swiper('right');
                } 
            }
        } else {
            // console.log('swipeX trashhold')
        }
    } else {
        if (Math.abs(yDiff) > DIFF_TRASHOLD && timeDiff < TIME_TRASHOLD) {
            if (yDiff > 0) {
                swiper('up');
            } else {      
                if(yDown < 50){
                    swiper('down');
                }
            }
        } else {
            // console.log('swipeY trashhold')
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
    timeDown = null;
}

containsClassName = function (evntarget, classArr) {
    for (var i = classArr.length - 1; i >= 0; i--) {
        if (evntarget.classList.contains(classArr[i])) {
            return true;
        }
    }
}

handleTouchStart = function (evt) {
    let touchStartTarget = evt.target;
    if (containsClassName(touchStartTarget, SWIPE_BLOCK_ELEMS)) {
        return;
    }
    timeDown = Date.now()
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
    xDiff = 0;
    yDiff = 0;

}

handleTouchMove = function (evt) {
    if (!xDown || !yDown) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;


    xDiff = xDown - xUp;
    yDiff = yDown - yUp;
}
