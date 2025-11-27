package com.hometutor.entity;

import jakarta.persistence.*;

@Entity
public class BookingRequest {
    public enum Status { PENDING, APPROVED, REJECTED }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne private StudentProfile student;
    @ManyToOne private TutorProfile tutor;
    @ManyToOne
    private User user;  // the user who made this booking


    private String subject;
    private String requestedSlot;
    // Link to TutorSlot id when booking a specific slot
    private Long slotId;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    public Long getId(){ return id; }
    public StudentProfile getStudent(){ return student; }
    public void setStudent(StudentProfile student){ this.student=student; }
    public TutorProfile getTutor(){ return tutor; }
    public void setTutor(TutorProfile tutor){ this.tutor=tutor; }
    public String getSubject(){ return subject; }
    public void setSubject(String subject){ this.subject=subject; }
    public String getRequestedSlot(){ return requestedSlot; }
    public void setRequestedSlot(String requestedSlot){ this.requestedSlot=requestedSlot; }
    public Long getSlotId(){ return slotId; }
    public void setSlotId(Long slotId){ this.slotId = slotId; }
    public Status getStatus(){ return status; }
    public void setStatus(Status status){ this.status=status; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

}
