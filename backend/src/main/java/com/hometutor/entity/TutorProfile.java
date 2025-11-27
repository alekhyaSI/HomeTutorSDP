package com.hometutor.entity;

import jakarta.persistence.*;

@Entity
public class TutorProfile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private User user;

    private String subjects;
    private String availableDays;
    private String timeSlots;
    private String phone;
    private Double ratePerHour;
    @Lob
    private String photoUrl;
    // Basic tutor information
    private String fullName;
    @Lob
    private String qualifications;
    @Lob
    private String bio;
    private String city;
    private String address;
    private Integer experienceYears;

    public Long getId(){ return id; }
    public User getUser(){ return user; }
    public void setUser(User user){ this.user=user; }
    public String getSubjects(){ return subjects; }
    public void setSubjects(String subjects){ this.subjects=subjects; }
    public String getAvailableDays(){ return availableDays; }
    public void setAvailableDays(String availableDays){ this.availableDays=availableDays; }
    public String getTimeSlots(){ return timeSlots; }
    public void setTimeSlots(String timeSlots){ this.timeSlots=timeSlots; }
    public String getPhone(){ return phone; }
    public void setPhone(String phone){ this.phone=phone; }
    public Double getRatePerHour(){ return ratePerHour; }
    public void setRatePerHour(Double ratePerHour){ this.ratePerHour=ratePerHour; }
    public String getPhotoUrl(){ return photoUrl; }
    public void setPhotoUrl(String photoUrl){ this.photoUrl = photoUrl; }
    public String getFullName(){ return fullName; }
    public void setFullName(String fullName){ this.fullName = fullName; }
    public String getQualifications(){ return qualifications; }
    public void setQualifications(String qualifications){ this.qualifications = qualifications; }
    public String getBio(){ return bio; }
    public void setBio(String bio){ this.bio = bio; }
    public String getCity(){ return city; }
    public void setCity(String city){ this.city = city; }
    public String getAddress(){ return address; }
    public void setAddress(String address){ this.address = address; }
    public Integer getExperienceYears(){ return experienceYears; }
    public void setExperienceYears(Integer experienceYears){ this.experienceYears = experienceYears; }
}
