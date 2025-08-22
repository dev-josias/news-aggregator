<?php
return [
        'newsapi' => [
        'base_url' => env('NEWSAPI_BASE_URL', 'https://newsapi.org/v2'),
        'key'      => env('NEWSAPI_KEY'),
        'page_size'=> 100,
        'language' => 'en',
    ],
    'guardian' => [
        'base_url' => env('GUARDIAN_BASE_URL', 'https://content.guardianapis.com'),
        'key'      => env('GUARDIAN_API_KEY'),
        'page_size'=> 50,
    ],
    'nyt' => [
        'base_url' => env('NYT_BASE_URL', 'https://api.nytimes.com/svc'),
        'key'      => env('NYT_API_KEY'),
        'secret_key' => env('NYT_API_SECRET_KEY'),
        'page_size'=> 10,
    ],

    'adapters' => [
        'guardian',
        'newsapi',
        'nyt',
    ],
];