<?php

namespace App\Enums;

enum UserType: string
{
    case Customer = 'customer';
    case SalesRep = 'sales rep';
    case Lead = 'lead';
    case Partner = 'partner';
    case SystemUser = 'system_user';
    case Default = 'default';

}
