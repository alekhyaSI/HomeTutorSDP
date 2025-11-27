package com.hometutor.auth;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class AuthTokenService {
    public static class Principal { public Long userId; public String role; public Principal(Long u, String r){userId=u;role=r;} }
    private static final Map<String, Principal> TOKENS = new ConcurrentHashMap<>();

    public static String createToken(Long userId, String role){
        String t = UUID.randomUUID().toString();
        TOKENS.put(t, new Principal(userId, role));
        return t;
    }

    public static Principal getByToken(String token){ return TOKENS.get(token); }

    public static void removeToken(String token){ TOKENS.remove(token); }
}
