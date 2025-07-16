<x-mail::message>
# Welcome {{ $user->name }}

You have now been registered at Donation Life

Here are your login credentials:

-**Email**: {{ $user->email }}

<br>
<br>

-**Password**: {{ $plainPassword }}

<x-mail::button :url="url('/login')">
Login Now
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
