<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuthorResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\SourceResource;
use App\Repositories\TaxonomyRepository;
use Illuminate\Http\Request;

class TaxonomyController extends Controller
{
    public function sources(TaxonomyRepository $repo)
    {
        return SourceResource::collection($repo->sources());
    }

    public function categories(TaxonomyRepository $repo)
    {
        return CategoryResource::collection($repo->categories());
    }

    public function authors(TaxonomyRepository $repo)
    {
        return AuthorResource::collection($repo->authors());
    }
}
