package com.hometutor.controller;

import com.hometutor.entity.User;
import com.hometutor.repository.UserRepository;
import com.hometutor.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dev")
public class DevController {
    private final UserRepository userRepository;
    private final UserService userService;

    public DevController(UserRepository userRepository, UserService userService){
        this.userRepository = userRepository;
        this.userService = userService;
    }

    // Create or return an admin user (development helper)
    @PostMapping("/seed-admin")
    public ResponseEntity<?> seedAdmin(@RequestBody(required = false) Map<String,String> body){
        String email = body!=null && body.containsKey("email") ? body.get("email") : "admin@example.com";
        String password = body!=null && body.containsKey("password") ? body.get("password") : "adminpass";
        User u = userRepository.findByEmail(email).orElse(null);
        if(u==null){
            u = new User();
            u.setEmail(email);
            u.setPassword(password);
            u.setRole(User.Role.ADMIN);
            u.setStatus(User.ApprovalStatus.APPROVED);
            u.setName("Administrator");
            userService.save(u);
            return ResponseEntity.ok(Map.of("message","created", "email", email));
        }
        return ResponseEntity.ok(Map.of("message","exists", "email", email));
    }
}
