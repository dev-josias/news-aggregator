<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListArticlesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "q" => "nullable|string|max:255",
            "from" => "nullable|date",
            "to" => "nullable|date|after_or_equal:from",
            "category" => "nullable|exists:categories,id",
            "source" => "nullable|exists:sources,id",
            "author" => "nullable|exists:authors,id",
            "pageSize" => "nullable|integer|max:50"
        ];
    }
}
