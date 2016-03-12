// Project fc
var Project = function (obj) {
    this.id = obj.id || null; // number
    this.name = obj.name || "New project"; // string
    this.timestamps = obj.timestamps || {}; // object
    this.activeTimer = obj.activeTimer || 0; // number
    this.timers = obj.timers || { // object
        0: "0", // object
        1: "1" // object
    }
}

Project.prototype.addTimestamp = function () {
    var activeTimer = this.activeTimer;
    var newTimestamp = new Timestamp(activeTimer, (this.timestamps[0] > 0) ? this.timestamps[0] : new Date());
    this.timestamps[Object.keys(this.timestamps).length] = newTimestamp;
}

Project.prototype.toggleTimers = function () {
    this.activeTimer = Number(!this.activeTimer);
}

Project.prototype.getActiveTimer = function () { // number
    return this.activeTimer;
}

Project.prototype.getLastTimer = function () { // number
    return this.lastTimer;
}

Project.prototype.getTimers = function () { // array of strings
    return this.timers;
}

Project.prototype.getTimestamps = function () { // array of arrays of date/numbers in milliseconds
    var arr = [];
    var tmpArr = [];
    var activeTimer = this.activeTimer;
    var lastTimer = this.lastTimer;
    var timestamps = this.timestamps;
    var timers = this.timers;

    for (var tm in timers) {
        tmpArr = [];
        for (var ts in timestamps) {
            console.log();
            if (tm == timestamps[ts].timer) {
                tmpArr.unshift(timestamps[ts].date);
            }
        }
        arr.push(tmpArr); // enclose each timers' timestamp list into a single array Y
    }
    return arr; // and return
}

Project.prototype.getLastTimestamp = function () {
    return this.timestamps[Object.keys(this.timestamps).length - 1];
}

Project.prototype.getDurations = function () { // array of sums
    var timestamps = this.timestamps;
    var startDate = timestamps["0"];
    var tmpArr0 = [];
    var tmpArr1 = [];
    var dur = 0;
    var dur0 = 0,
        dur1 = 0,
        endDate = 0;

    for (var ts in timestamps) {
        var tmpArr = [];
        var timer = timestamps[ts].timer;

        if (ts != "0") {
            endDate = timestamps[ts].date;
            dur = endDate - startDate;
            //console.log(dur);
        } else {
            endDate = timestamps["0"].date;
        }
        startDate = endDate;
        if (timer == "0") {
            tmpArr0.unshift(dur);
        } else {
            tmpArr1.unshift(dur);
        }
        //console.log(dur0, dur1)
    }
    return [tmpArr0, tmpArr1];
}

Project.prototype.getSums = function () { // arrays of durations

    //get timestamps, calculate elapsed times between each entry, collect to two arrays then

    var timestamps = this.timestamps;
    var startDate = timestamps["0"];
    var dur0 = 0,
        dur1 = 0,
        endDate = 0;

    for (var ts in timestamps) {
        var dur = 0;
        var timer = timestamps[ts].timer;

        if (ts != "0") {
            endDate = timestamps[ts].date;
            dur = endDate - startDate;
            //console.log(dur);
        } else {
            endDate = timestamps["0"].date;
            dur = 0;
            //console.log(dur);
        }
        startDate = endDate;
        if (timer == "0") {
            dur0 += dur;
        } else {
            dur1 += dur;
        }
        //console.log(dur0, dur1)
    }
    return [dur0, dur1];
}
