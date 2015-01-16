var clearCanvas, clock, drawCenterDot,
    drawClockFace, drawCountdown, drawHand,
    drawMark, drawTime, drawTimePeriod, drawTomato, getAngle;

    clock = {};
    share = {};

  clock.halfWidth = 240;

  clock.halfHeight = 240;

  clock.radius = 200;
  clock.negativeOn = true;
  clock.colorOn = true;

  clock.innerDotRadius = clock.radius / 50;

  clock.minutehandlength = clock.radius * 0.8;

  clock.secondhandlength = clock.radius * 0.9;

  clock.hourhandlength = clock.radius * 0.5;

  clock.qmlength = clock.radius / 10;

  drawMark = function(ctx, x, y, angle, length) {
    var r, xe, xs, ye, ys;
    r = clock.radius;
    xs = x + r * Math.cos(angle);
    ys = y + r * Math.sin(angle);
    xe = x + (r - length) * Math.cos(angle);
    ye = y + (r - length) * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(xs, ys);
    ctx.lineTo(xe, ye);
    ctx.closePath();
    ctx.stroke();
  };

drawClockFace = function(ctx,color) {
    var i, _i, _j, _k;
    ctx.save();
    ctx.fillStyle = "#"+negative(color)
    // ctx.fillStyle = "lightgrey";
    ctx.strokeStyle = "#"+color;
    //ctx.fillStyle = "white";
    ctx.lineCap = "square";
    ctx.lineWidth = 5.0;
    ctx.beginPath();
    ctx.arc(clock.halfWidth, clock.halfHeight, clock.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.lineWidth = clock.radius / 100;
    for (i = _i = 0; _i <= 60; i = ++_i) {
      drawMark(ctx, clock.halfWidth, clock.halfHeight, i * (Math.PI / 30), clock.qmlength);
    }
    ctx.lineWidth = clock.radius / 50;
    for (i = _j = 0; _j <= 12; i = ++_j) {
      drawMark(ctx, clock.halfWidth, clock.halfHeight, i * (Math.PI / 6), clock.qmlength + clock.radius / 20);
    }
    ctx.lineWidth = clock.radius / 25;
    for (i = _k = 0; _k <= 3; i = ++_k) {
      drawMark(ctx, clock.halfWidth, clock.halfHeight, i * (Math.PI / 2), clock.qmlength + clock.radius / 8);
    }
    ctx.restore();
  };

drawCenterDot = function(ctx,color) {
    ctx.save();
    ctx.strokeStyle = "#"+negative(color)
    ctx.strokeStyle = "#"+color;
    //ctx.fillStyle = "black";
    //ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(clock.halfWidth, clock.halfHeight, clock.innerDotRadius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  };

  drawHand = function(ctx, length, angle) {
    ctx.beginPath();
    ctx.moveTo(clock.halfWidth, clock.halfHeight);
    ctx.lineTo(clock.halfWidth + length * Math.cos(angle), clock.halfHeight + length * Math.sin(angle));
    ctx.closePath();
    ctx.stroke();
  };

  getAngle = function(length, roundlength, sublength, subroundlength) {
    if (sublength == null) {
      sublength = 0;
    }
    if (subroundlength == null) {
      subroundlength = 1;
    }
    return -(Math.PI / 2) + (2 * Math.PI * length / roundlength) + (2 * Math.PI * sublength / (roundlength * subroundlength));
  };

  drawTime = function(ctx, h, m, s, color) {
    ctx.save();
    ctx.lineWidth = 7;
    drawHand(ctx, clock.hourhandlength, getAngle(h, 12, m, 60));
    ctx.lineWidth = 5;
    drawHand(ctx, clock.minutehandlength, getAngle(m, 60, s, 60));
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";
    drawHand(ctx, clock.secondhandlength, getAngle(s, 60));
    ctx.restore();
  };

  drawTimePeriod = function(ctx, x, y, radius, sm, ss, em, es) {
    var e, s;
    s = getAngle(sm, 60, ss, 60);
    e = getAngle(em, 60, es, 60);
    ctx.save();
    ctx.lineWidth = 6.0;
    ctx.beginPath();
    ctx.arc(x, y, radius, s, e, false);
    ctx.arc(x, y, radius, e, s, true);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  };

  drawTomato = function(ctx, clock, tomato) {
    var bm, breaklength, bs, em, end, es, sm, ss, start, tbreak, timeleft;
    start = new Date(tomato.start);
    timeleft = tomato.timeleft;
    breaklength = tomato.breaklength;
    if (tomato.end != null) {
      end = new Date(tomato.end);
    } else {
      end = new Date();
      end.setTime(end.getTime() + timeleft * 1000);
    }
    tbreak = new Date(end.getTime() + breaklength * 60 * 1000);
    sm = start.getMinutes();
    ss = start.getSeconds();
    em = end.getMinutes();
    es = end.getSeconds();
    bm = tbreak.getMinutes();
    bs = tbreak.getSeconds();
    ctx.save();
    ctx.strokeStyle = "red";
    drawTimePeriod(ctx, clock.halfWidth, clock.halfHeight, clock.radius, sm, ss, em, es);
    ctx.strokeStyle = "blue";
    drawTimePeriod(ctx, clock.halfWidth, clock.halfHeight, clock.radius, em, es, bm, bs);
    ctx.restore();
  };

  drawCountdown = function(ctx, cx, cy, radius, h, m, s) {
    var str;
    str = "";
    s = Math.round(s);
    if (h > 0) {
      str += h + ":";
    }
    if (m >= 10) {
      str += m + ":";
    } else if (m > 0) {
      str += "0" + m + ":";
    }
    if (s >= 10) {
      str += s;
    } else if (s > 0) {
      str += "0" + s;
    } else {
      str += "00";
    }
      drawStr(ctx,cx,cy,radius,str)
  };
drawStr = function(ctx,cx,cy,radius,str,color){
    ctx.save();
    ctx.fillStyle = "#" +color;
    ctx.strokeStyle = "#" +color;
    ctx.font = "32pt Inconsolata,monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.beginPath();
    ctx.fillText(str, cx, cy + (Math.floor(radius / 2)));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

negative = function(str){
    num = parseInt(str,16)
    largest = parseInt("FFFFFF",16)
    return (largest-num).toString(16)
}

  clearCanvas = function(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.height, ctx.canvas.width);
  };

  share.drawCurrentTime = function(h,m,s,dbg) {
    var bl, canvas, countdownOn, counter, ctx, h, m, paused, s, sh, sm, ss, stime, time, tomato, wl;
    canvas = document.getElementById("clock");
    ctx = canvas.getContext("2d");
    time = new Date();
    if (!dbg){
        h = time.getHours();// % 12;
        m = time.getMinutes();
        s = time.getSeconds();
    }
    timestr = getTimeString(h,m,s);
    hourVal = getColorHourVal(h,m,s);
    minVal = getColorMinVal(h,m,s);
    secVal = getColorSecVal(h,m,s);

    color = getColorFromTime(hourVal,minVal,secVal);
    if(!clock.colorOn){
        color ="000000";
    }
    if (!clock.negativeOn){
        color = negative(color);
    }
    if(dbg)
    {console.log(color);}
    
    clearCanvas(ctx);
    drawClockFace(ctx,color);
    ctx.save();
    ctx.fillStyle = ("#"+color);
    ctx.strokeStyle = ("#"+color);
    drawTime(ctx, h % 12, m, s, color);
    drawCenterDot(ctx, color);
    ctx.restore();
    drawStr(ctx, clock.halfWidth, clock.halfHeight, 3*clock.radius, timestr,negative(color));
    setBackground("#"+color);
  };

//Return a value between 0-255.
getColorHourVal = function(hour,min,sec) {
    return 10*12 - 10*Math.abs(12-hour);
}
getColorMinVal = function(hour,min,sec) {
    return 2*30 - 2*Math.abs(30-min);
}

getColorSecVal = function(hour,min,sec) {
    return 3*30 - 3*Math.abs(30-sec);
}

getColorFromTime = function(hour,min,sec) {
    h = Math.floor(hour).toString(16);
    m = Math.floor(min).toString(16);
    s = Math.floor(sec).toString(16);
    if (h.length < 2) h = "0"+h;
    if (m.length < 2) m = "0"+m;
    if (s.length < 2) s = "0"+s;
    return (h+m+s);

}

setBackgroundColorToTime = function(h,m,s){
    color = "#"
    color += getTimeString(h,m,s);
    setBackground(color);
}
getTimeString = function(h,m,s){
    time = ""
    if(h < 10) {
        time += "0"
    }
    time += "" + h;
    if(m < 10) {
        time += "0"
    }
    time += "" + m;
    if(s < 10) {
        time += "0"
    }
    time += "" + s;
    return time;
}

setBackground = function(color){
    document.getElementsByTagName("body")[0].style.background = color;
}

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

timeInterval = 0;

ready(function(){
    share.drawCurrentTime();
    timeInterval = setInterval('share.drawCurrentTime()',100);
    window.addEventListener("mousedown",function(){clock.negativeOn = !clock.negativeOn});
})

Number.prototype.mod = function(n) {
        return ((this%n)+n)%n;
};
testsecs = 0;
testmin = 0;
testhour = 0;
test = function (timelength) {
    timelength = timelength | 2000;
    clearInterval(timeInterval);
        
};
clockOn = true;

    keyhandler = function (e) {
        o = 79;
        l = 76;
        i = 73;
        k = 75;
        u = 85;
        j = 74;
        t = 84;
        c = 67;
        n = 78;
        switch(e.keyCode) {
            case t:
                if(clockOn) 
                { 
                    clearInterval(timeInterval);
                    time = new Date();
                    testhour = time.getHours();// % 12;
                    testmin = time.getMinutes();
                    testsecs = time.getSeconds();
                }  else {
                    timeInterval = setInterval('share.drawCurrentTime()',100);
                }
                clockOn = !clockOn;
                break;
            case n:
                clock.negativeOn = !clock.negativeOn;
                share.drawCurrentTime();
                break;
            case c:
                clock.colorOn = !clock.colorOn;
                share.drawCurrentTime();
                break;
        }

        if (!clockOn){
            switch (e.keyCode) {
                case o:
                    clearInterval(timeInterval);
                    testsecs = (testsecs + 1);
                    break;
                case l:
                    clearInterval(timeInterval);
                    testsecs = (testsecs - 1);
                    break;
                case i:
                    clearInterval(timeInterval);
                    testmin = (testmin + 1);
                    break;
                case k:
                    clearInterval(timeInterval);
                    testmin = (testmin - 1);
                    break;
                case u:
                    clearInterval(timeInterval);
                    testhour = (testhour + 1);
                    break;
                case j:
                    clearInterval(timeInterval);
                    testhour = (testhour - 1);
                    break;
            }
            if(testsecs >= 60){ testsecs = 0; testmin++;}
            if(testmin >= 60){ testmin = 0; testhour++;}
            if(testhour >= 24){ testhour = 0;}
            if(testsecs < 00){ testsecs = 59; testmin--;}
            if(testmin < 00){ testmin = 59; testhour--;}
            if(testhour < 00){ testhour = 23;}
            share.drawCurrentTime(testhour,testmin,testsecs,true);
        }
    }
window.addEventListener("keydown",keyhandler);


runTest = function(n,last,timelength) {
    last = last | tests.length;
    console.log("running: ", n);
    tests[n]();
    if(n < last-1)
        setTimeout(function(){runTest(n+1,last,timelength);}, timelength);
}


