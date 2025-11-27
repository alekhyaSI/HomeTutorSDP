package com.hometutor.controller;

import com.hometutor.entity.User;
import com.hometutor.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService){ this.userService = userService; }

    @GetMapping("/{id}")
    public Map<String,Object> getUser(@PathVariable Long id){
    // security: only admin or the same user
    com.hometutor.auth.AuthTokenService.Principal current = com.hometutor.auth.CurrentUser.get();
    if(current==null) throw new RuntimeException("Unauthorized");
    if(!current.role.equals("ADMIN") && !current.userId.equals(id)) throw new RuntimeException("Forbidden");

    User u = userService.get(id);
    return Map.of(
        "id", u.getId(),
        "email", u.getEmail(),
        "name", u.getName(),
        "phone", u.getPhone(),
        "role", u.getRole(),
        "status", u.getStatus(),
        "createdAt", u.getCreatedAt()
    );
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String,String> body){
        com.hometutor.auth.AuthTokenService.Principal current = com.hometutor.auth.CurrentUser.get();
        if(current==null) throw new RuntimeException("Unauthorized");
        if(!current.role.equals("ADMIN") && !current.userId.equals(id)) throw new RuntimeException("Forbidden");

        User u = userService.get(id);
        if(body.containsKey("email")) u.setEmail(body.get("email"));
        if(body.containsKey("password")) u.setPassword(body.get("password"));
        if(body.containsKey("name")) u.setName(body.get("name"));
        if(body.containsKey("phone")) u.setPhone(body.get("phone"));
        userService.save(u); // persist changes
        return ResponseEntity.ok().build();
    }
}
