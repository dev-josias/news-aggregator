<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ListArticlesRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Repositories\ArticleRepository;

use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index(ListArticlesRequest $request, ArticleRepository $repository) {
        $articles = $repository->list($request->validated());

        return ArticleResource::collection($articles);
    }

    public function show(Article $article) {
        return new ArticleResource($article);
    }
}
