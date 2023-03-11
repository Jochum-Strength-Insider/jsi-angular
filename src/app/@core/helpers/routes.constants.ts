import { Injectable } from '@angular/core';

// Not sure this is going to work how I'd like.
// The router module needs an object without prefaced '/' while the RouterLink in a component needs the '/' and is easiler to import as a class.

// This is a good pattern for regular constants though and can be broken up and imported only where needed.

@Injectable({
    providedIn: 'root'
})
export class RouteConstants {
    public LANDING = '/';
    public SIGN_UP = '/signup';
    public INSIDER = '/insider-signup';
    public SIGN_IN = '/signin';
    public SIGN_IN_LINK = '/email-signin';
    public PASSWORD_FORGET = '/pw-forget';
    public HOME = '/home';
    public ACCOUNT = '/account';
    public TRACKING = '/tracking';
    public DIET = '/diet-sheet';
    public WEIGHIN = '/weigh-in';
    public MESSAGES = '/messages';
    public ADMIN_MESSAGES = '/admin-messages';
    public ADMIN_MESSAGES_USER = '/admin-messages/:uid';
    public ACCOUNT_PROGRAM = '/account/:pid';
    public ADMIN = '/admin';
    public ADMIN_MOBILE = '/admin-mobile';
    public USERPROGRAM = '/program';
    public ADMIN_DETAILS = '/admin/:id';
    public ADMIN_DETAILS_PROFILE = '/admin/:id/profile';
    public ADMIN_DETAILS_MESSAGES = '/admin/:id/messages';
    public ADMIN_DETAILS_WORKOUTS = '/admin/:id/workouts';
    public ADMIN_DETAILS_MOBILE = '/admin-mobile/:id';
    public WORKOUTS = '/admin-user-programs';
    public WORKOUT_DETAILS = '/admin-user-programs/:id/:pid';
    public PROGRAM_DETAILS = '/admin/:id/:pid';
    public CREATEPROGRAM = '/create-program';
    public CREATETASK = '/create-exercise';
    public CREATECODE = '/create-code';
    public CREATE_DETAILS = '/create-program/:pid';
    public WELCOME = '/welcome';
    public SUBSCRIBE = '/subscribe';
  }