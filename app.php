<?php

use React\EventLoop\Factory;
use React\Http\Response;
use React\Http\Server as HttpServer;
use React\Socket\Server as SocketServer;
use Thruway\ClientSession;
use Thruway\Middleware;
use Thruway\Peer\Client;
use Thruway\Peer\Router;
use WyriHaximus\React\Http\Middleware\RewriteMiddleware;
use WyriHaximus\React\Http\Middleware\WebrootPreloadMiddleware;
use function React\Promise\resolve;

require 'vendor/autoload.php';

(function () {
    $loop = Factory::create();

    $timers = [];
    $router = new Router($loop);
    $internalClient = new Client('blaat', $loop);
    $internalClient->on('open', function (ClientSession $session) use (&$timers, $loop): void {
        $session->register('time', function () {
            return resolve(date('r', time()));
        });
        $timers[spl_object_hash($session)] = $loop->addPeriodicTimer(1, function () use ($session) {
            $session->publish('time', [date('r', time())]);
        });
    });
    $internalClient->on('close', function (ClientSession $session) use (&$timers, $loop): void {
        $session->unregister('time');
        $loop->cancelTimer($timers[spl_object_hash($session)]);
    });
    $router->addInternalClient($internalClient);
    $router->start(false);

    $socket = new SocketServer('0.0.0.0:1337', $loop);
    $http = new HttpServer([
        new Middleware(['/'], $loop, $router),
        new RewriteMiddleware([
            '/' => '/index.html',
        ]),
        new WebrootPreloadMiddleware(__DIR__ . '/public/'),
        function () {
            return new Response(404);
        }
    ]);

    $http->listen($socket);

    $loop->run();
})();
