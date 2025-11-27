package com.hometutor.controller;

import com.hometutor.entity.User;
import com.hometutor.repository.UserRepository;
import com.hometutor.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final UserRepository userRepository;

    public AuthController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String,String> body){
        String email = body.get("email");
        if(userRepository.findByEmail(email).isPresent()){
            return ResponseEntity.badRequest().body(Map.of("error","Email already registered"));
        }
        User u = new User();
        u.setEmail(email);
        u.setPassword(body.get("password")); // demo only
        u.setRole(User.Role.valueOf(body.get("role")));
        u.setStatus(User.ApprovalStatus.PENDING);
        return ResponseEntity.ok(userService.register(u));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> body){
        String email = body.get("email");
        String password = body.get("password");
        System.out.println("[Auth] login attempt for: " + email);
        return userRepository.findByEmail(email).map(u -> {
            if(u.getPassword() == null || !u.getPassword().equals(password)){
                System.out.println("[Auth] invalid password for: " + email);
                return ResponseEntity.status(401).body(Map.of("error","Invalid credentials"));
            }
            // Check approval status
            if(u.getStatus() == User.ApprovalStatus.PENDING){
                System.out.println("[Auth] login blocked - account pending approval: " + email);
                return ResponseEntity.status(403).body(Map.of("error","Account pending approval"));
            }
            if(u.getStatus() == User.ApprovalStatus.REJECTED){
                System.out.println("[Auth] login blocked - account rejected: " + email);
                return ResponseEntity.status(403).body(Map.of("error","Account rejected"));
            }
            String token = com.hometutor.auth.AuthTokenService.createToken(u.getId(), u.getRole().toString());
            System.out.println("[Auth] login success for: " + email + " role=" + u.getRole());
            return ResponseEntity.ok(Map.of("message","login ok","userId",u.getId(),"role",u.getRole().toString(),"status",u.getStatus().toString(),"token",token));
        }).orElseGet(() -> {
            System.out.println("[Auth] user not found: " + email);
            return ResponseEntity.status(401).body(Map.of("error","User not found"));
        });
    }
}
