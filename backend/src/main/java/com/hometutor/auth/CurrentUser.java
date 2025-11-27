package com.hometutor.auth;

public class CurrentUser {
    private static final ThreadLocal<AuthTokenService.Principal> TL = new ThreadLocal<>();
    public static void set(AuthTokenService.Principal p){ TL.set(p); }
    public static AuthTokenService.Principal get(){ return TL.get(); }
    public static void clear(){ TL.remove(); }
}
