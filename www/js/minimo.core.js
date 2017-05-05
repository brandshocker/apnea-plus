// MINIMO CORE 1.1

log = function (i) {
    console.log(i);
}

o = function (id) {
    return document.getElementById(id);
}

s = function (id) {
    return o(id).style;
}


const SWIPE_BLOCK_ELEMS = [
  'swipBlock',
  'handle',
  'drag-ruble'
]

let xDown = null;
let yDown = null;
let xDiff = null;
let yDiff = null;
let timeDown = null;
const TIME_TRASHOLD = 200;
const DIFF_TRASHOLD = 130;

handleTouchEnd = function () {

    let timeDiff = Date.now() - timeDown;
    if (Math.abs(xDiff) > Math.abs(yDiff)) { /*most significant*/
        if (Math.abs(xDiff) > DIFF_TRASHOLD && timeDiff < TIME_TRASHOLD) {
            if (xDiff > 0) {
                // console.log(xDiff, TIME_TRASHOLD, DIFF_TRASHOLD)
                log('go left');
                swiper('left');
            } else {
                // console.log(xDiff)
                log('go right');
                swiper('right');
            }
        } else {
            // console.log('swipeX trashhold')
        }
    } else {
        if (Math.abs(yDiff) > DIFF_TRASHOLD && timeDiff < TIME_TRASHOLD) {
            if (yDiff > 0) {
                swiper('up');
            } else {
                swiper('down');
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
