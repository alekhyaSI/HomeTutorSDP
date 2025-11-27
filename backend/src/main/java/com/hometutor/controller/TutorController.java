package com.hometutor.controller;

import com.hometutor.entity.BookingRequest;
import com.hometutor.entity.TutorProfile;
import com.hometutor.entity.TutorSlot;
import com.hometutor.service.BookingService;
import com.hometutor.service.TutorService;
import com.hometutor.service.TutorSlotService;
import com.hometutor.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/tutor")
public class TutorController {

    private final TutorService tutorService;
    private final BookingService bookingService;
    private final TutorSlotService tutorSlotService;
    private final UserService userService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public TutorController(
            TutorService tutorService,
            BookingService bookingService,
            TutorSlotService tutorSlotService,
            UserService userService) {
        this.tutorService = tutorService;
        this.bookingService = bookingService;
        this.tutorSlotService = tutorSlotService;
        this.userService = userService;
    }

    // ---------------------------------------------------------
    // CREATE OR UPDATE PROFILE (Auto-detect)
    // ---------------------------------------------------------
    @PostMapping("/profile")
    public TutorProfile saveProfile(@RequestBody Map<String, Object> req) {

        com.hometutor.auth.AuthTokenService.Principal current =
                com.hometutor.auth.CurrentUser.get();

        if (current == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");

        Long uid;

        // Determine user ID (admin can update others)
        if (req.containsKey("userId")) {
            Object uidObj = req.get("userId");
            uid = uidObj instanceof Number
                    ? ((Number) uidObj).longValue()
                    : Long.valueOf(uidObj.toString());

            if (!current.role.equals("ADMIN") && !current.userId.equals(uid))
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");

        } else {
            uid = current.userId;
        }

        // Auto-detect: already exists? → update
        TutorProfile tp = tutorService.findByUserId(uid);

        if (tp == null) {
            tp = new TutorProfile();
            tp.setUser(userService.get(uid));
        }

        // -------------------------
        // subjects
        // -------------------------
        if (req.containsKey("subjects")) {
            Object o = req.get("subjects");
            try {
                if (o instanceof String) tp.setSubjects((String) o);
                else tp.setSubjects(objectMapper.writeValueAsString(o));
            } catch (Exception e) {
                tp.setSubjects(o.toString());
            }
        }

        // -------------------------
        // availableDays
        // -------------------------
        if (req.containsKey("availableDays")) {
            Object o = req.get("availableDays");
            try {
                if (o instanceof String) tp.setAvailableDays((String) o);
                else tp.setAvailableDays(objectMapper.writeValueAsString(o));
            } catch (Exception e) {
                tp.setAvailableDays(o.toString());
            }
        }

        // -------------------------
        // timeSlots
        // -------------------------
        if (req.containsKey("timeSlots")) {
            Object o = req.get("timeSlots");
            try {
                if (o instanceof String) tp.setTimeSlots((String) o);
                else tp.setTimeSlots(objectMapper.writeValueAsString(o));
            } catch (Exception e) {
                tp.setTimeSlots(o.toString());
            }
        }

        // -------------------------
        // phone
        // -------------------------
        if (req.containsKey("phone"))
            tp.setPhone((String) req.get("phone"));

        // -------------------------
        // price per hour
        // -------------------------
        if (req.containsKey("ratePerHour")) {
            Object rate = req.get("ratePerHour");
            if (rate instanceof Number)
                tp.setRatePerHour(((Number) rate).doubleValue());
            else
                tp.setRatePerHour(Double.valueOf(rate.toString()));
        }

        // -------------------------
        // photo
        // -------------------------
        if (req.containsKey("photoBase64"))
            tp.setPhotoUrl((String) req.get("photoBase64"));
        else if (req.containsKey("photoUrl"))
            tp.setPhotoUrl((String) req.get("photoUrl"));

        // -------------------------
        // basic details
        // -------------------------
        if (req.containsKey("fullName")) tp.setFullName((String) req.get("fullName"));
        if (req.containsKey("qualifications")) tp.setQualifications((String) req.get("qualifications"));
        if (req.containsKey("bio")) tp.setBio((String) req.get("bio"));
        if (req.containsKey("city")) tp.setCity((String) req.get("city"));
        if (req.containsKey("address")) tp.setAddress((String) req.get("address"));
        if (req.containsKey("experienceYears")) {
            Object ey = req.get("experienceYears");
            if (ey instanceof Number) tp.setExperienceYears(((Number) ey).intValue());
            else try { tp.setExperienceYears(Integer.valueOf(ey.toString())); } catch(Exception ex){}
        }

        return tutorService.save(tp);
    }

    // ---------------------------------------------------------
    // GET PROFILE BY USER
    // ---------------------------------------------------------
    @GetMapping("/profile/by-user/{userId}")
    public TutorProfile profileByUser(@PathVariable Long userId) {
        return tutorService.findByUserId(userId);
    }

    @GetMapping("/profile/for-user/{userId}")
    public Map<String,Object> profileForUser(@PathVariable Long userId){
        TutorProfile tp = tutorService.findByUserId(userId);
        if(tp==null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "TutorProfile not found");
        Map<String,Object> out = new HashMap<>();
        out.put("id", tp.getId());
        out.put("fullName", tp.getFullName());
        out.put("phone", tp.getPhone());
        out.put("ratePerHour", tp.getRatePerHour());
        out.put("photoUrl", tp.getPhotoUrl());
        out.put("qualifications", tp.getQualifications());
        out.put("bio", tp.getBio());
        out.put("city", tp.getCity());
        out.put("address", tp.getAddress());
        out.put("experienceYears", tp.getExperienceYears());
        try{
            String s = tp.getSubjects();
            if(s==null || s.isBlank()) out.put("subjects", List.of());
            else if(s.trim().startsWith("[")) out.put("subjects", objectMapper.readValue(s, List.class));
            else out.put("subjects", List.of(s));
        }catch(Exception ex){ out.put("subjects", List.of()); }
        try{
            String d = tp.getAvailableDays();
            if(d==null || d.isBlank()) out.put("availableDays", List.of());
            else if(d.trim().startsWith("[")) out.put("availableDays", objectMapper.readValue(d, List.class));
            else out.put("availableDays", List.of(d));
        }catch(Exception ex){ out.put("availableDays", List.of()); }
        try{
            String t = tp.getTimeSlots();
            if(t==null || t.isBlank()) out.put("timeSlots", List.of());
            else if(t.trim().startsWith("[") || t.trim().startsWith("{")) out.put("timeSlots", objectMapper.readValue(t, List.class));
            else out.put("timeSlots", List.of(t));
        }catch(Exception ex){ out.put("timeSlots", List.of()); }
        return out;
    }

    // ---------------------------------------------------------
    // EXPLICIT UPDATE (PUT)
    // ---------------------------------------------------------
    @PutMapping("/profile/{id}")
    public TutorProfile updateProfile(@PathVariable Long id, @RequestBody Map<String, Object> req) {

        TutorProfile tp = tutorService.get(id);

        // subjects
        if (req.containsKey("subjects")) {
            Object o = req.get("subjects");
            try {
                if (o instanceof String) tp.setSubjects((String) o);
                else tp.setSubjects(objectMapper.writeValueAsString(o));
            } catch (Exception e) {
                tp.setSubjects(o.toString());
            }
        }

        // available days
        if (req.containsKey("availableDays")) {
            Object o = req.get("availableDays");
            try {
                if (o instanceof String) tp.setAvailableDays((String) o);
                else tp.setAvailableDays(objectMapper.writeValueAsString(o));
            } catch (Exception e) {
                tp.setAvailableDays(o.toString());
            }
        }

        // time slots
        if (req.containsKey("timeSlots")) {
            Object o = req.get("timeSlots");
            try {
                if (o instanceof String) tp.setTimeSlots((String) o);
                else tp.setTimeSlots(objectMapper.writeValueAsString(o));
            } catch (Exception e) {
                tp.setTimeSlots(o.toString());
            }
        }

        // phone
        if (req.containsKey("phone"))
            tp.setPhone((String) req.get("phone"));

        // rate
        if (req.containsKey("ratePerHour")) {
            Object rate = req.get("ratePerHour");
            if (rate instanceof Number)
                tp.setRatePerHour(((Number) rate).doubleValue());
            else
                tp.setRatePerHour(Double.valueOf(rate.toString()));
        }

        // photo
        if (req.containsKey("photoUrl"))
            tp.setPhotoUrl((String) req.get("photoUrl"));
        else if (req.containsKey("photoBase64"))
            tp.setPhotoUrl((String) req.get("photoBase64"));

        // -------------------------
        // basic details (PUT)
        // -------------------------
        if (req.containsKey("fullName")) tp.setFullName((String) req.get("fullName"));
        if (req.containsKey("qualifications")) tp.setQualifications((String) req.get("qualifications"));
        if (req.containsKey("bio")) tp.setBio((String) req.get("bio"));
        if (req.containsKey("city")) tp.setCity((String) req.get("city"));
        if (req.containsKey("address")) tp.setAddress((String) req.get("address"));
        if (req.containsKey("experienceYears")) {
            Object ey = req.get("experienceYears");
            if (ey instanceof Number) tp.setExperienceYears(((Number) ey).intValue());
            else try { tp.setExperienceYears(Integer.valueOf(ey.toString())); } catch(Exception ex){}
        }

        return tutorService.save(tp);
    }

    // ---------------------------------------------------------
    // BOOKING REQUESTS (STUDENT → TUTOR)
    // ---------------------------------------------------------
    @GetMapping("/requests/{tutorId}")
    public List<BookingRequest> requests(@PathVariable Long tutorId) {
        return bookingService.all().stream()
                .filter(b -> b.getTutor() != null && b.getTutor().getId().equals(tutorId))
                .toList();
    }

    @PutMapping("/requests/{bookingId}/approve")
    public BookingRequest approve(@PathVariable Long bookingId) {
        return bookingService.approve(bookingId);
    }

    @PutMapping("/requests/{bookingId}/reject")
    public BookingRequest reject(@PathVariable Long bookingId) {
        return bookingService.reject(bookingId);
    }

    // ---------------------------------------------------------
    // DASHBOARD STATS
    // ---------------------------------------------------------
    @GetMapping("/dashboard/{tutorId}")
    public Map<String, Object> dashboard(@PathVariable Long tutorId) {

        Map<String, Object> m = new HashMap<>();

        List<BookingRequest> mine = bookingService.all().stream()
                .filter(b -> b.getTutor() != null && b.getTutor().getId().equals(tutorId))
                .toList();

        long pending = mine.stream().filter(b -> b.getStatus() == BookingRequest.Status.PENDING).count();
        long approved = mine.stream().filter(b -> b.getStatus() == BookingRequest.Status.APPROVED).count();

        m.put("totalRequests", mine.size());
        m.put("pendingRequests", pending);
        m.put("approvedRequests", approved);
        m.put("requests", mine);

        return m;
    }

    // ---------------------------------------------------------
    // SLOTS
    // ---------------------------------------------------------
    @PostMapping("/slots")
    public TutorSlot createSlot(@RequestBody Map<String, Object> req) {

        com.hometutor.auth.AuthTokenService.Principal current =
                com.hometutor.auth.CurrentUser.get();

        if (current == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");

        if (!req.containsKey("tutorId"))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "tutorId required");

        Long tid = Long.valueOf(req.get("tutorId").toString());
        TutorProfile tutor = tutorService.get(tid);

        TutorSlot s = new TutorSlot();
        s.setTutor(tutor);
        s.setDate((String) req.getOrDefault("date", ""));
        s.setStart((String) req.getOrDefault("start", ""));
        s.setEnd((String) req.getOrDefault("end", ""));

        if (req.containsKey("open"))
            s.setOpen((Boolean) req.get("open"));

        return tutorSlotService.save(s);
    }

    @GetMapping("/slots/{tutorId}")
    public List<TutorSlot> listSlots(@PathVariable Long tutorId) {
        TutorProfile t = tutorService.get(tutorId);
        return tutorSlotService.findByTutor(t);
    }

    @PutMapping("/slots/{slotId}/toggle")
    public TutorSlot toggleSlot(@PathVariable Long slotId) {
        TutorSlot s = tutorSlotService.get(slotId);
        s.setOpen(!s.isOpen());
        return tutorSlotService.save(s);
    }

    @DeleteMapping("/slots/{slotId}")
    public void deleteSlot(@PathVariable Long slotId) {
        tutorSlotService.delete(slotId);
    }
}
