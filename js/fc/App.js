// App fc
var App = function (project, interfaces, ref) {
    this.ref = ref;
    this.project = project;
    this.interfaces = interfaces;
    this.timer;
}

App.prototype.saveToDB = function (url, data) {
    this.ref.child(url).set(data);
}

App.prototype.toggleButton = function () {
    this.project.addTimestamp();
    this.stopTimer();
    this.project.toggleTimers();
    this.startTimer();
    // print times
    this.interfaces.displaySums(this.project.getSums());
    this.interfaces.displayTimeList(this.project.getDurations(), this.project.getTimestamps());
    // save to db
    this.saveToDB("/timestamps/", this.project.timestamps);
    this.saveToDB("/activeTimer/", this.project.activeTimer);
    // this.saveToDB("/timers/", this.project.timers);
}

App.prototype.resetButton = function () {
    this.stopTimer();
    this.project.activeTimer = 0;
    this.project.timestamps = {};
    // print times
    this.interfaces.displaySums(this.project.getSums());
    this.interfaces.displayTimeList(this.project.getDurations(), this.project.getTimestamps());
    // save to db
    this.saveToDB("/timestamps/", this.project.timestamps);
    this.saveToDB("/activeTimer/", this.project.activeTimer);
    // this.saveToDB("/timers/", this.project.timers);
}

App.prototype.logout = function () {
    console.log("logout called");
    this.interfaces.loginForm.setAttribute("style", "display: inline-block");
    this.interfaces.timerButtons.setAttribute("style", "display: none");
    this.interfaces.logoutButton.setAttribute("style", "display: none");
    this.ref.unauth();
    window.localStorage.username = "";
    window.localStorage.password = "";
    location.reload();
}

App.prototype.init = function () {
    // get timelists and elapsed times
    this.interfaces.toggleTimerButton.disabled = false;
    this.interfaces.resetTimerButton.disabled = false;

    this.interfaces.timerButtons.setAttribute("style", "display: inline-block");
    this.interfaces.logoutButton.setAttribute("style", "display: inline-block");
    this.interfaces.loginForm.setAttribute("style", "display: none");

    this.interfaces.toggleTimerButton.addEventListener("click", this.toggleButton.bind(this), false);
    this.interfaces.resetTimerButton.addEventListener("click", this.resetButton.bind(this), false);
    this.interfaces.logoutButton.addEventListener("click", this.logout.bind(this), false);
    //    this.interfaces.loginButton.addEventListener("click", this.login.bind(this), false);

    this.interfaces.displaySums(this.project.getSums()); // 
    this.interfaces.displayTimeList(this.project.getDurations(), this.project.getTimestamps()); // 

    this.startTimer();

    this.interfaces.projectName.innerHTML = this.project.name;
    this.interfaces.projectName.addEventListener("blur", function () {
        this.project.name = this.interfaces.projectName.innerHTML;
        this.saveToDB("/name/", this.project.name);
    }.bind(this), false);

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
    // start a set interval, increase timer by 1 s every 1000 ms
    if (lastTimestamp)
        this.timer = setInterval(function () {
            var timeElapsed = new Date() - lastTimestamp.date;
            var newDuration = this.project.getSums()[activeTimer] + timeElapsed;
            // update display
            this.interfaces.sumDisplays[activeTimer].innerHTML = this.interfaces.parseDuration(newDuration);
            //console.log(this.project.activeTimer)
        }.bind(this), 1000);
};

App.prototype.stopTimer = function () {
    clearInterval(this.timer);
};
