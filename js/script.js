(function (App, Project, Interfaces, Timestamp) {
    'use strict'

    // Firebase connection
    var fbRef = new Firebase('https://crackling-inferno-3492.firebaseio.com/');

    // Interfaces fc
    var Interfaces = function () {
        this.projectName = document.getElementById("project-name");
        // buttons, displays
        this.toggleTimerButton = document.getElementById("toggle-timer-button");
        // this.stopTimerButton = document.getElementById("stop-timer-button");
        this.liDisplays = [document.getElementById("time-0"), document.getElementById("time-1")];
        this.sumDisplays = [document.getElementById("sum-0-display"), document.getElementById("sum-1-display")];
        this.timerHeaders = [document.getElementById("timer-name-0"), document.getElementById("timer-name-1")];
    }

    Interfaces.prototype.displaySums = function (arr) {
        // add from code
        this.sumDisplays[0].innerHTML = this.parseDuration(arr[0]);
        this.sumDisplays[1].innerHTML = this.parseDuration(arr[1]);
    }

    Interfaces.prototype.parseDate = function (d) {
        if (d) {
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

    Interfaces.prototype.parseDuration = function (ms) {
        var seconds = Math.floor((ms / 1000) % 60);
        var minutes = Math.floor((ms / (1000 * 60)) % 60);
        var hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        var days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 7);
        var durd = (days > 0) ? days + "d " : "";
        var durh = (hours > 0) ? hours + ":" : "";
        var durm = (minutes > 0) ? ((minutes < 10) ? "0" + minutes : minutes) + ":" : "";
        var durs = (seconds >= 1) ? ((seconds < 10) ? "0" + seconds : seconds) + "s" : "";
        var durms = (seconds < 1) ? ((ms < 10) ? "0" + ms : ms) + "ms" : "";
        return durd + durh + durm + durs + durms;
    };

    Interfaces.prototype.displayTimeList = function (arr1, arr2) {
        // add from code
        var listHTML;
        var l = arr1.length;
        for (var i = 0; i < l; i++) {
            listHTML = "";
            for (var j = 0; j < arr1[i].length; j++) {
                listHTML += "<tr>"
                listHTML += '<td>' + '<span class="tooltipp">' + this.parseDuration(arr1[i][j]);
                listHTML += '<span class="tooltiptext">' + this.parseDate(new Date(arr2[i][j])) + "</span>" + "</span>" + "</td>";
                listHTML += "</tr>"
            }
            this.liDisplays[i].innerHTML = listHTML;
        }
    };

    // Timestamp fc
    var Timestamp = function (timer, date) {
        this.date = date.getTime();
        this.timer = timer;
    };

    // Project fc
    var Project = function (obj) {
        this.id = obj.id || null; // number
        this.name = obj.name || "New project"; // string
        this.timestamps = obj.timestamps || {}; // object
        this.activeTimer = obj.activeTimer || 0; // number
        this.timers = obj.timers || { // object
            0: "timer0", // object
            1: "timer1" // object
        }
    }

    Project.prototype.addTimestamp = function () {
        var timerStr = "timer";
        var activeTimer = timerStr + this.activeTimer;
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
                if (timers[tm] == timestamps[ts].timer) {
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
            if (timer == "timer0") {
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
            if (timer == "timer0") {
                dur0 += dur;
            } else {
                dur1 += dur;
            }
            //console.log(dur0, dur1)
        }
        return [dur0, dur1];
    }

    // App fc
    var App = function (project, interfaces) {
        this.project = project;
        this.interfaces = interfaces;
        this.timer;
    }

    App.prototype.saveToDB = function (url, data) {
        fbRef.child(url).set(data);
    }

    App.prototype.toggleButton = function () {
        this.project.addTimestamp();
        this.project.toggleTimers();
        this.stopTimer();
        this.startTimer();
        // print times
        this.interfaces.displaySums(this.project.getSums());
        this.interfaces.displayTimeList(this.project.getDurations(), this.project.getTimestamps());
        // save to db
        this.saveToDB("/timestamps/", this.project.timestamps);
        this.saveToDB("/activeTimer/", this.project.activeTimer);
        this.saveToDB("/timers/", this.project.timers);
    }

    App.prototype.init = function () {
        // get timelists and elapsed times
        this.interfaces.toggleTimerButton.disabled = false;
        // this.interfaces.stopTimerButton.disabled = false;
        this.interfaces.toggleTimerButton.addEventListener("click", this.toggleButton.bind(this), false);
        // this.interfaces.stopTimerButton.addEventListener("click", this.stopTimer.bind(this), false);
        this.interfaces.displaySums(this.project.getSums()); // => Interfaces
        this.interfaces.displayTimeList(this.project.getDurations(), this.project.getTimestamps()); // => Interfaces
        this.startTimer();
        this.interfaces.projectName.innerHTML = this.project.name;
        this.interfaces.projectName.addEventListener("blur", function () {
            this.project.name = this.interfaces.projectName.innerHTML;
            this.saveToDB("/name/", this.project.name);
        }.bind(this), false)
        for (var i = 0; i < this.interfaces.timerHeaders.length; i++) {
            this.interfaces.timerHeaders[i].innerHTML = this.project.timers[i];
            (function (i) {
                var timerHeader = this.interfaces.timerHeaders[i]
                timerHeader.addEventListener("blur", function () {
                    console.log(timerHeader.innerHTML, this);
                    this.project.timers[i] = timerHeader.innerHTML;
                    this.saveToDB("/timers/" + [i], this.project.timers[i]);
                }.bind(this), false)
            }).apply(this, [i]);
        };
    };

    App.prototype.startTimer = function () {
        var lastTimestamp = this.project.getLastTimestamp();
        // get active timer
        var activeTimer = this.project.activeTimer;
        //console.log(lastTimestamp, activeTimer);
        // start a set interval, increase timer by t ms
        this.timer = setInterval(function () {
            var timeElapsed = new Date() - lastTimestamp.date;
            var newDuration = this.project.getSums()[activeTimer] + timeElapsed;
            // update display
            this.interfaces.sumDisplays[activeTimer].innerHTML = this.interfaces.parseDuration(newDuration);
        }.bind(this), 1000);
    };

    App.prototype.stopTimer = function () {
        console.log("stop timer")
        clearInterval(this.timer);
    };

    fbRef.once("value", function (data) {
        if (data.val()) {
            var project = new Project(data.val());
            console.log("Project loaded!");
        } else {
            console.log("Project not found, initialized a new project!");
            var project = new Project("myProject");
        }
        // intentiate interfaces
        var interfaces = new Interfaces();
        // init app
        var app = new App(project, interfaces);
        app.init();
    });

})();
