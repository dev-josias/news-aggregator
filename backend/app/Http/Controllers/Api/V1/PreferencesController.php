<?php

namespace App\Http\Controllers\Api\V1;

use App\Contracts\PreferencesRepository;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdatePreferencesRequest;
use App\Services\PreferencesService;
use Illuminate\Http\Request;

class PreferencesController extends Controller
{
    public function show(Request $request, PreferencesRepository $repo)
    {
        return response()->json($repo->get($request->user()->id));
    }

    public function update(UpdatePreferencesRequest $request, PreferencesService $service)
    {
        $service->update($request->user()->id, $request->validated());
        return response()->noContent();
    }
}
