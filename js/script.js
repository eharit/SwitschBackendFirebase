(function () {
    'use strict'

    // Project object
    var Project = function (obj) {
        this.id = obj.id || null;
        this.name = obj.name || "New project";
        this.timestamps = obj.timestamps || {};
        this.activeTimer = obj.activeTimer || 0;
        this.lastTimer = obj.lasttimer || 1;
        this.timers = obj.timers || {
            0: "timer0",
            1: "timer1"
        }
    }

    Project.prototype.addTimestamp = function () { // void
        var activeTimer = timerStr + this.activeTimer;
        var newTimestamp = new Timestamp(activeTimer, (this.timestamps[0] > 0) ? this.timestamps[0] : new Date());
        this.timestamps[Object.keys(this.timestamps).length] = newTimestamp;
        console.log(this)
    }

    Project.prototype.switchTimers = function () { // void
        var activeTimerNum = this.activeTimer;
        var lastTimerNum = this.lastTimer;
        this.activeTimer = lastTimerNum;
        this.lastTimer = activeTimerNum;
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
                if (timers[tm] == timestamps[ts].timer) {
                    tmpArr.unshift(timestamps[ts].date);
                }
            }
            arr.push(tmpArr); // enclose each timers' timestamp list into a single array and return
        }
        return arr;
    }

    // Firebase connection
    var fbRef = new Firebase('https://crackling-inferno-3492.firebaseio.com/');

    // DOM elements
    var toggleTimerButton = document.getElementById("toggle-timer-button");
    var liDisplays = [document.getElementById("time-1"), document.getElementById("time-2")];
    var h2Display = document.getElementById("h2-display");

    // variables
    var timers = [];
    var timersCount = 2;
    var project = {};
    var timerStr = "timer";

    var Timestamp = function (timer, date) {
        this.date = date.getTime();
        this.timer = timer;
    }

    fbRef.once("value", function (data) {
        if (data.val()) {
            project = new Project(data.val());
            console.log("Project loaded!");
        } else {
            console.log("Project not found, initialized a new project!");
            project = new Project("myProject");
        }
        // init app
        init(project);
    })

    function init(project) {

        // add click event listener to button
        toggleTimerButton.addEventListener('click', switsch);

        // enable button
        toggleTimerButton.disabled = false;
    }

    function switsch() {
        var timestampsByTimers = project.getTimestamps();
        project.addTimestamp();
        project.switchTimers();
        fbRef.child("/timestamps/").set(project.timestamps);
    }



    // the rest of the program shuould be refactored to display data

    function oldSwitsch() {

        var activeTimerNum = project.activeTimer;
        var lastTimerNum = project.lastTimer;
        var activeTimer = timers[activeTimerNum];
        var lastTimer = timers[lastTimerNum];

        // add new date to the timer's date list
        activeTimer.addTimestamp();

        // add list of timestamps to project
        var newTimestamp = new Timestamp(activeTimer, (activeTimer.timestamps[0] > 0) ? activeTimer.timestamps[0] : new Date());
        project.timestamps[project.timestamps.length] = newTimestamp;

        // sync object with Firebase db


        // switch timers
        project.lastTimer = activeTimerNum;
        project.activeTimer = (activeTimerNum === 0) ? 1 : 0;

        // ---------------------------------------------- ouput  --------------------------------------------------

        // calculate elapsed time
        var startTime = (timers[lastTimerNum].timestamps[0]) ? timers[lastTimerNum].timestamps[0] : 0;
        var endTime = (timers[activeTimerNum].timestamps[0]) ? timers[activeTimerNum].timestamps[0] : 0;
        var timeElapsed = getDuration(endTime - startTime);

        var dateOutput = [];
        var l = activeTimer.timestamps.length;
        for (var i = 0; i < l; i++) {
            var niceDate = convertDate(activeTimer.timestamps[i]);
            dateOutput.push(niceDate);
        }

        // time entry list
        displayTimeList(dateOutput, activeTimerNum);

        // time elapsed
        h2Display.innerHTML = lastTimer.name + ': ' + timeElapsed;

        // log
        // console.log(convertDate(project.timers[activeTimer][project.timers[activeTimer].length - 1]), activeTimer.name, lastTimer.name);
        // console.log(timers, lastTimer.name, startTime, activeTimer.name, endTime);
        // object to save

        // console.log(project);
    }

    // display functions

    function displayTimeList(arr, timerNum) {
        liDisplays[timerNum].innerHTML = '<li>' + arr.join('</li><li>') + '</li>';
    }

    // helper functions

    function convertDate(d) {
        if (d) {
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var year = d.getFullYear();
            var month = months[d.getMonth()];
            var day = days[d.getDay()];
            var hour = d.getHours();
            var min = d.getMinutes();
            var sec = d.getSeconds();
            if (min < 10) min = "0" + min;
            if (sec < 10) sec = "0" + sec;
            //            return day + ' ' + hour + ':' + min + ':' + sec;
            return day + ", " + hour + ':' + min + ':' + sec;
        } else {
            return "0";
        }
    }

    //format duration from http://stackoverflow.com/questions/175554/how-to-convert-milliseconds-into-human-readable-form
    function getDuration(ms) {
        var dur = "";
        var seconds = Math.floor((ms / 1000) % 60);
        var minutes = Math.floor((ms / (1000 * 60)) % 60);
        var hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        var days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 7);
        var durd = (days > 0) ? days + "d " : "";
        var durh = (hours > 0) ? hours + "h " : "";
        var durm = (minutes > 0) ? ((minutes < 10) ? "0" + minutes : minutes) + "min " : "";
        var durs = (seconds > 0) ? ((seconds < 10) ? "0" + seconds : seconds) + "sec" : "";
        return durd + durh + durm + durs;
    }
})();
