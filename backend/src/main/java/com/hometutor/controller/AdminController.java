package com.hometutor.controller;

import com.hometutor.entity.BookingRequest;
import com.hometutor.entity.TutorProfile;
import com.hometutor.entity.User;
import com.hometutor.service.BookingService;
import com.hometutor.service.TutorService;
import com.hometutor.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserService userService;
    private final TutorService tutorService;
    private final BookingService bookingService;

    public AdminController(UserService userService, TutorService tutorService, BookingService bookingService){
        this.userService = userService;
        this.tutorService = tutorService;
        this.bookingService = bookingService;
    }

    @GetMapping("/pending")
    public List<User> pending(){
        com.hometutor.auth.AuthTokenService.Principal current = com.hometutor.auth.CurrentUser.get();
        if(current==null || !"ADMIN".equals(current.role)) throw new RuntimeException("Forbidden");
        return userService.listPending();
    }

    @PutMapping("/approve/{userId}")
    public User approve(@PathVariable Long userId){
        com.hometutor.auth.AuthTokenService.Principal current = com.hometutor.auth.CurrentUser.get();
        if(current==null || !"ADMIN".equals(current.role)) throw new RuntimeException("Forbidden");
        return userService.approve(userId);
    }

    @PutMapping("/reject/{userId}")
    public User reject(@PathVariable Long userId){
        com.hometutor.auth.AuthTokenService.Principal current = com.hometutor.auth.CurrentUser.get();
        if(current==null || !"ADMIN".equals(current.role)) throw new RuntimeException("Forbidden");
        return userService.reject(userId);
    }

    @GetMapping("/users")
    public List<User> users(){
        com.hometutor.auth.AuthTokenService.Principal current = com.hometutor.auth.CurrentUser.get();
        if(current==null || !"ADMIN".equals(current.role)) throw new RuntimeException("Forbidden");
        return userService.list();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id){
        com.hometutor.auth.AuthTokenService.Principal current = com.hometutor.auth.CurrentUser.get();
        if(current==null || !"ADMIN".equals(current.role)) throw new RuntimeException("Forbidden");
        userService.delete(id); return ResponseEntity.ok().build(); }

    @GetMapping("/tutor-availability")
    public List<TutorProfile> tutorAvailability(){
        com.hometutor.auth.AuthTokenService.Principal current = com.hometutor.auth.CurrentUser.get();
        if(current==null || !"ADMIN".equals(current.role)) throw new RuntimeException("Forbidden");
        return tutorService.list();
    }

    @GetMapping("/bookings")
    public List<BookingRequest> bookings(){
        com.hometutor.auth.AuthTokenService.Principal current = com.hometutor.auth.CurrentUser.get();
        if(current==null || !"ADMIN".equals(current.role)) throw new RuntimeException("Forbidden");
        return bookingService.all();
    }

    @GetMapping("/dashboard")
    public Map<String,Object> dashboard(){
        com.hometutor.auth.AuthTokenService.Principal current = com.hometutor.auth.CurrentUser.get();
        if(current==null || !"ADMIN".equals(current.role)) throw new RuntimeException("Forbidden");

        Map<String,Object> m = new HashMap<>();
        List<User> allUsers = userService.list();
        List<User> pending = userService.listPending();
        List<TutorProfile> tutors = tutorService.list();
        List<BookingRequest> bookings = bookingService.all();

        m.put("totalUsers", allUsers.size());
        m.put("pendingApprovals", pending.size());
        m.put("totalTutors", tutors.size());
        m.put("totalBookings", bookings.size());
        long pendingBookings = bookings.stream().filter(b -> b.getStatus() == BookingRequest.Status.PENDING).count();
        long approvedBookings = bookings.stream().filter(b -> b.getStatus() == BookingRequest.Status.APPROVED).count();
        m.put("pendingBookings", pendingBookings);
        m.put("approvedBookings", approvedBookings);
        // include a short list of recent bookings (ids)
        m.put("recentBookings", bookings.stream().map(BookingRequest::getId).limit(10).toList());
        return m;
    }
}
