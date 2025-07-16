<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\UserRequest;
use App\Mail\SystemUserWelcomeMail;
use App\Models\User;
use App\Enums\UserType;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class SystemUsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $users = User::query()
        ->select('id','name','email','phone','referral_code','password_updated_at')
        ->where('user_type',UserType::SystemUser)
        ->latest()
        ->paginate(10)
        ->withQueryString();
        return Inertia::render('Users/SystemUsers/Index',[
            'users'=>$users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return Inertia::render('Users/SystemUsers/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'phone'=>'required|string|max:15|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' =>$validated['phone'],
            'user_type' => UserType::SystemUser,
            'password' => Hash::make($validated['password']),
            'password_change_required' => true
        ]);

        event(new Registered($user));

        Mail::to($user->email)->queue(new SystemUserWelcomeMail($user,$validated['password']));
         // Redirect with flash message
        return redirect()->route('system-users.index')->with('success', 'User created successfully. Login credentials have been sent via email.');

        // Auth::login($user);

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $user = User::findOrFail($id);
        return Inertia::render('Users/SystemUsers/Edit', [
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request,$id)
    {
        $data = $request->validated();
        $user = User::findOrFail($id);


        if (empty($data['password'])) {
            unset($data['password'], $data['password_confirmation']);
        }
        $user->update($data);
        return Redirect::route('system-users.index')->with('success', 'User  Details Updated Successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->back()->with('success', 'User Successfully deleted');
    }
}
