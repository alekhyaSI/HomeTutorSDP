package com.hometutor.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.hometutor.entity.BookingRequest;
import com.hometutor.entity.StudentProfile;
import com.hometutor.entity.TutorProfile;
import com.hometutor.entity.User;
import com.hometutor.service.BookingService;
import com.hometutor.service.StudentService;
import com.hometutor.service.TutorService;
import com.hometutor.service.UserService;

@RestController
@RequestMapping("/api/student")
@CrossOrigin("*")
public class StudentController {
	private final StudentService studentService;
	private final TutorService tutorService;
	private final BookingService bookingService;
	private final UserService userService;
	private final com.hometutor.service.TutorSlotService tutorSlotService;

	public StudentController(StudentService studentService, TutorService tutorService, BookingService bookingService,
			UserService userService, com.hometutor.service.TutorSlotService tutorSlotService) {
		this.studentService = studentService;
		this.tutorService = tutorService;
		this.bookingService = bookingService;
		this.userService = userService;
		this.tutorSlotService = tutorSlotService;
	}

	@GetMapping("/profile/{id}")
	public StudentProfile profile(@PathVariable Long id) {
		return studentService.get(id);
	}

	@PostMapping("/profile")
	public StudentProfile saveProfile(@RequestBody Map<String, String> b) {
		com.hometutor.auth.AuthTokenService.Principal current = com.hometutor.auth.CurrentUser.get();
		if (current == null)
			throw new org.springframework.web.server.ResponseStatusException(
					org.springframework.http.HttpStatus.UNAUTHORIZED, "Unauthorized");

		StudentProfile s = new StudentProfile();
		s.setPhone(b.get("phone"));
		s.setFullName(b.get("fullName"));
		s.setFatherName(b.get("fatherName"));
		s.setDob(b.get("dob"));
		s.setAddress(b.get("address"));
		s.setCity(b.get("city"));
		if (b.containsKey("school"))
			s.setSchool(b.get("school"));
		if (b.containsKey("grade"))
			s.setGrade(b.get("grade"));
		// accept either a url or a base64 data string under photoBase64
		if (b.containsKey("photoUrl"))
			s.setPhotoUrl(b.get("photoUrl"));
		else if (b.containsKey("photoBase64"))
			s.setPhotoUrl(b.get("photoBase64"));
		// if userId provided, ensure owner or admin
		if (b.containsKey("userId")) {
			Long uid = Long.valueOf(b.get("userId"));
			if (!current.role.equals("ADMIN") && !current.userId.equals(uid))
				throw new org.springframework.web.server.ResponseStatusException(
						org.springframework.http.HttpStatus.FORBIDDEN, "Forbidden");
			// attach user and copy basic info into the user record if provided
			com.hometutor.entity.User u = userService.get(uid);
			if (b.containsKey("name"))
				u.setName(b.get("name"));
			if (b.containsKey("phone"))
				u.setPhone(b.get("phone"));
			// fatherName is stored on profile; optional to mirror to user.name or another
			// field if desired
			userService.save(u);
			s.setUser(u);
		} else {
			// default to current user
			com.hometutor.entity.User u = userService.get(current.userId);
			if (b.containsKey("name"))
				u.setName(b.get("name"));
			if (b.containsKey("phone"))
				u.setPhone(b.get("phone"));
			userService.save(u);
			s.setUser(u);
		}
		return studentService.save(s);
	}

	@GetMapping("/profile/by-user/{userId}")
	public StudentProfile profileByUser(@PathVariable Long userId) {
		com.hometutor.auth.AuthTokenService.Principal current = com.hometutor.auth.CurrentUser.get();
		if (current == null)
			throw new org.springframework.web.server.ResponseStatusException(
					org.springframework.http.HttpStatus.UNAUTHORIZED, "Unauthorized");
		if (!current.role.equals("ADMIN") && !current.userId.equals(userId))
			throw new org.springframework.web.server.ResponseStatusException(
					org.springframework.http.HttpStatus.FORBIDDEN, "Forbidden");
		return studentService.findByUserId(userId);
	}

	@PutMapping("/profile/{id}")
	public StudentProfile updateProfile(@PathVariable Long id, @RequestBody Map<String, String> b) {
		com.hometutor.auth.AuthTokenService.Principal current = com.hometutor.auth.CurrentUser.get();
		if (current == null)
			throw new org.springframework.web.server.ResponseStatusException(
					org.springframework.http.HttpStatus.UNAUTHORIZED, "Unauthorized");
		StudentProfile s = studentService.get(id);
		Long ownerId = s.getUser() != null ? s.getUser().getId() : null;
		if (!current.role.equals("ADMIN") && (ownerId == null || !ownerId.equals(current.userId)))
			throw new org.springframework.web.server.ResponseStatusException(
					org.springframework.http.HttpStatus.FORBIDDEN, "Forbidden");
		if (b.containsKey("phone"))
			s.setPhone(b.get("phone"));
		if (b.containsKey("fullName"))
			s.setFullName(b.get("fullName"));
		if (b.containsKey("fatherName"))
			s.setFatherName(b.get("fatherName"));
		if (b.containsKey("dob"))
			s.setDob(b.get("dob"));
		if (b.containsKey("address"))
			s.setAddress(b.get("address"));
		if (b.containsKey("city"))
			s.setCity(b.get("city"));
		if (b.containsKey("school"))
			s.setSchool(b.get("school"));
		if (b.containsKey("grade"))
			s.setGrade(b.get("grade"));
		if (b.containsKey("photoUrl"))
			s.setPhotoUrl(b.get("photoUrl"));
		else if (b.containsKey("photoBase64"))
			s.setPhotoUrl(b.get("photoBase64"));
		// also update linked user basic info when provided
		if (s.getUser() != null) {
			com.hometutor.entity.User u = s.getUser();
			if (b.containsKey("name"))
				u.setName(b.get("name"));
			if (b.containsKey("phone"))
				u.setPhone(b.get("phone"));
			userService.save(u);
		}
		return studentService.save(s);
	}

	@GetMapping("/search")
	public List<TutorProfile> search(@RequestParam(required = false) String subject,
			@RequestParam(required = false) String day, @RequestParam(required = false) Double maxCost) {
		return tutorService.search(subject, day, maxCost);
	}

	@PostMapping("/request")
	public BookingRequest create(@RequestBody Map<String, String> dto) {

		System.out.println("=== REACHED BOOKING ENDPOINT ===");
		System.out.println("Received DTO: " + dto);

		// Get current logged in user
		com.hometutor.auth.AuthTokenService.Principal current = com.hometutor.auth.CurrentUser.get();

		if (current == null)
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");

		Long tutorId = Long.valueOf(dto.get("tutorId"));
		Long studentId = current.userId;
		Long slotId = dto.containsKey("slotId") ? Long.valueOf(dto.get("slotId")) : null;

		// Permission check
		if (!current.role.equals("ADMIN") && !current.userId.equals(studentId))
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");

		TutorProfile t = tutorService.get(tutorId);
		User s = userService.get(studentId);

		BookingRequest br = new BookingRequest();
		br.setUser(s);
		br.setTutor(t);
		br.setSubject(dto.get("subject"));

		// Slot handling
		if (slotId != null) {
			com.hometutor.entity.TutorSlot slot = tutorSlotService.get(slotId);

			if (!slot.isOpen())
				throw new ResponseStatusException(HttpStatus.CONFLICT, "Slot already booked");

			slot.setOpen(false);
			tutorSlotService.save(slot);

			br.setSlotId(slotId);
			br.setRequestedSlot(slot.getDate() + " " + slot.getStart() + "-" + slot.getEnd());
		} else {
			br.setRequestedSlot(dto.get("requestedSlot"));
		}

		// Save booking
		BookingRequest result = bookingService.create(br);
		System.out.println("Booking created successfully: " + result.getId());

		return result;
	}

	@GetMapping("/requests/{studentId}")
	public List<BookingRequest> myRequests(@PathVariable Long studentId) {
		return bookingService.all().stream()
				.filter(b -> b.getUser() != null && b.getUser().getId().equals(studentId)).toList();
	}

	@GetMapping("/dashboard/{studentId}")
	public Map<String, Object> dashboard(@PathVariable Long studentId) {

	    Map<String, Long> statusCounts = bookingService.getStatusCountsForUser(studentId);
	    long approved = statusCounts.getOrDefault("APPROVED", 0L);
	    long pending = statusCounts.getOrDefault("PENDING", 0L);
	    long rejected = statusCounts.getOrDefault("REJECTED", 0L);

	    List<BookingRequest> requests = bookingService.findByUserId(studentId);

	    Map<String, Object> m = new HashMap<>();
	    m.put("totalRequests", requests.size());
	    m.put("approvedRequests", approved);
	    m.put("pendingRequests", pending);
	    m.put("rejectedRequests", rejected);
	    m.put("requests", requests);

	    return m;
	}


}