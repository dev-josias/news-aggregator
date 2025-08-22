<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Services\FeedService;
use Illuminate\Http\Request;

class FeedController extends Controller
{
    public function __invoke(Request $request, FeedService $service)
    {
        $pageSize = min((int) $request->integer('pageSize', 20), 50);
        $paginator = $service->forUser($request->user()->id, $pageSize);
        return ArticleResource::collection($paginator);
    }
}
