<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'DubaiVest API') }}</title>
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            font-family: "Segoe UI", Arial, sans-serif;
            background: #f5f7fb;
            color: #1d2a44;
        }

        .panel {
            width: min(640px, 92vw);
            background: #fff;
            border: 1px solid #dbe3f0;
            border-radius: 12px;
            padding: 20px;
        }

        h1 {
            margin: 0 0 8px;
            font-size: 1.4rem;
        }

        p {
            margin: 6px 0;
            color: #5c6981;
        }
    </style>
</head>
<body>
    <main class="panel">
        <h1>{{ config('app.name', 'DubaiVest') }} API</h1>
        <p>Status: Operational</p>
        <p>Environment: {{ app()->environment() }} | Laravel: {{ app()->version() }}</p>
        <p>Presentation endpoints: POST /api/login, GET /api/users, GET /api/posts</p>
    </main>
</body>
</html>
