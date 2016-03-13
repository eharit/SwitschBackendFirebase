// Interfaces fc
var Interfaces = function () {
    this.projectName = document.getElementById("project-name");
    // buttons, displays
    this.toggleTimerButton = document.getElementById("toggle-timer-button");
    this.resetTimerButton = document.getElementById("reset-timer-button");
    this.logoutButton = document.getElementById("logout-button");
    this.loginButton = document.getElementById("login-button");
    this.loginForm = document.getElementById("login-form");
    this.timerButtons = document.getElementById("timer-buttons");
    this.usernameInput = document.getElementById("username");
    this.passwordInput = document.getElementById("password");
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
    var durh = (hours > 0) ? ((hours < 10) ? "0" + hours : hours) + ":" : "00:";
    var durm = (minutes > 0) ? ((minutes < 10) ? "0" + minutes : minutes) + ":" : "00:";
    var durs = (seconds >= 1) ? ((seconds < 10) ? "0" + seconds : seconds) + "" : "00";
    var durms = (seconds < 1 && minutes < 1 && hours < 1 && days < 1) ? ((ms < 10) ? "0" + ms : ms) + " ms" : "";
    return (!durms) ? durd + durh + durm + durs : durms;
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
