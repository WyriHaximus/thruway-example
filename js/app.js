import {Client} from "thruway.js";

(function () {
    const wamp = new Client(
        'ws://localhost:1337/',
        'blaat'
    );

    const timeHandler = function (time) {
        document.getElementById('time').innerHTML = time;
    };
    wamp.call('time', [/** args */]).toPromise().then(args  => timeHandler(args.args[0]));
    wamp.topic('time').subscribe(args  => timeHandler(args.args[0]));
})();
