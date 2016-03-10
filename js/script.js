(function (App, Project, Interfaces, Timestamp) {
    'use strict'

    // Firebase connection
    var fbRef = new Firebase('https://crackling-inferno-3492.firebaseio.com/');

    // Interfaces fc
    var Interfaces = function () {
        //buttons, displays
        this.toggleTimerButton = document.getElementById("toggle-timer-button");
        this.liDisplays = [document.getElementById("time-0"), document.getElementById("time-1")];
        this.sumDisplays = [document.getElementById("sum-0-display"), document.getElementById("sum-1-display")];
    }

    Interfaces.prototype.displaySums = function (arr) {
        // add from code
        this.sumDisplays[0].innerHTML = this.getDuration(arr[0]);
        this.sumDisplays[1].innerHTML = this.getDuration(arr[1]);
    }

    Interfaces.prototype.displayTimeList = function (arr) {
        // add from code
        var listHTML;
        var l = arr.length;
        for (var i = 0; i < l; i++) {
            listHTML = "";
            for (var j = 0; j < arr[i].length; j++) {
                listHTML += "<tr>"
                listHTML += "<td>" + this.convertDate(new Date(arr[i][j])) + "</td>";
                listHTML += "</tr>"
            }
            this.liDisplays[i].innerHTML = listHTML;
        }
    }

    Interfaces.prototype.convertDate = function (d) {
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

    Interfaces.prototype.getDuration = function (ms) {
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



    // App fc
    var App = function (project, interfaces) {
        this.project = project;
        this.interfaces = interfaces;
        this.timer;
    }

    App.prototype.toggleButton = function () {
        this.project.addTimestamp();
        this.project.toggleTimers();
        // print times
        this.interfaces.displaySums(this.project.getSums());
        this.interfaces.displayTimeList(this.project.getTimestamps());
        // save to db
        fbRef.child("/timestamps/").set(this.project.timestamps);
        fbRef.child("/activeTimer/").set(this.project.activeTimer);
    }

    App.prototype.init = function () {
        // get timelists and elapsed times
        this.interfaces.toggleTimerButton.disabled = false;
        this.interfaces.toggleTimerButton.addEventListener("click", this.toggleButton);
        this.interfaces.displaySums(this.project.getSums()); // => Interfaces
        this.interfaces.displayTimeList(this.project.getTimestamps()); // => Interfaces
        this.startTimer();
    }

    App.prototype.startTimer = function () {
        // get active timer
        var activeTimer = this.project.activeTimer;
        // start a set interval, increase timer by t ms
        this.timer = setInterval(function () {
            console.log("tick...")
        }, 1000);
        // update display
    };

    App.prototype.stopTimer = function () {
        // get active timer
        // start a set interval
        this.timer = window.clearInterval()
            // increase timer by t ms
            // update display
    };



    // Timestamp fc
    var Timestamp = function (timer, date) {
        this.date = date.getTime();
        this.timer = timer;
    }

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

    Project.prototype.addTimestamp = function () { // void
        var timerStr = "timer";
        var activeTimer = timerStr + this.activeTimer;
        var newTimestamp = new Timestamp(activeTimer, (this.timestamps[0] > 0) ? this.timestamps[0] : new Date());
        this.timestamps[Object.keys(this.timestamps).length] = newTimestamp;
    }

    Project.prototype.toggleTimers = function () { // void
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
            arr.push(tmpArr); // enclose each timers' timestamp list into a single array and return
        }
        return arr;
    }

    Project.prototype.getSums = function () { // array of sums
        //        var arr = [];
        //        var tmpArr0 = [];
        //        var tmpArr1 = [];
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
    })



})();
