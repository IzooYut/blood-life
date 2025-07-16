<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\UserRequest;
use App\Models\User;
use App\Enums\UserType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Redis;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $users = User::query()
            ->with(['user_country' => function ($query) {
                $query->select('id', 'name');
            }])
            ->select('id', 'name', 'email', 'phone', 'region', 'country', 'company_name', 'referral_code')
            ->where('user_type', UserType::Customer)
            ->latest()
            ->paginate(10)
            ->withQueryString();

            

        return Inertia::render('Users/Customers/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return Inertia::render('Users/Customers/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    /** @var \Illuminate\Foundation\Http\FormRequest $request */

    public function store(UserRequest $request)
    {
        //
        $referrer = null;
        $validated = $request->validated();

        if ($request->filled('referred_by_code')) {
            $referrer = User::where('referral_code', $validated['referred_by_code'])->first();
        }

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make('password'),
            'phone' => $validated['phone'],
            'referred_by_code' => $validated['referred_by_code'] ?? NULL,
            'referrer_id' => optional($referrer)->id,
            'country' => $validated['country'] ?? NULL,
            'region' => $validated['region'],
            'company_name' => $validated['company_name'] ?? NULL,
            'commission' => $validated['commission'] ?? NULL,
            'comment' => $validated['comment'] ?? NULL,
            'user_type' => UserType::Customer,
        ]);
        return Redirect::route('customers.index')->with('success', 'Customer Details Added Successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $user = User::findOrFail($id);
        return Inertia::render('Users/Customers/Edit', [
            'customer' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, $id)
    {
        //
        $data = $request->validated();

        $user = User::findOrFail($id);

        $user->update($data);
        return Redirect::route('customers.index')->with('success', 'Customer Details Updated Successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return Redirect::route('customers.index')->with('success', 'Customer Deleted Successfully');
    }
}
