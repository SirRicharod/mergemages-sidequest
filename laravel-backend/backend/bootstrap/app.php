<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

if (!function_exists('mb_split')) {
    /**
     * Fallback for environments without ext-mbstring.
     * Laravel uses mb_split() in Str::studly() during app boot.
     */
    function mb_split(string $pattern, string $string, int $limit = -1): array|false
    {
        $delimiter = '/';
        $escapedPattern = str_replace($delimiter, '\\'.$delimiter, $pattern);
        $regex = $delimiter.$escapedPattern.$delimiter.'u';

        $result = preg_split($regex, $string, $limit);

        return $result === false ? false : $result;
    }
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
