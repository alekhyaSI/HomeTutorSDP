package com.hometutor.entity;

import jakarta.persistence.*;

@Entity
public class StudentProfile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private User user;

    private String phone;
    private String fullName;
    private String fatherName;
    private String dob;
    private String address;
    private String city;
    private String school;
    private String grade;

    @Lob
    private String photoUrl;

    public Long getId(){ return id; }
    public User getUser(){ return user; }
    public void setUser(User user){ this.user=user; }
    public String getPhone(){ return phone; }
    public void setPhone(String phone){ this.phone=phone; }
    public String getFullName(){ return fullName; }
    public void setFullName(String fullName){ this.fullName = fullName; }
    public String getFatherName(){ return fatherName; }
    public void setFatherName(String fatherName){ this.fatherName = fatherName; }
    public String getDob(){ return dob; }
    public void setDob(String dob){ this.dob = dob; }
    public String getAddress(){ return address; }
    public void setAddress(String address){ this.address = address; }
    public String getCity(){ return city; }
    public void setCity(String city){ this.city = city; }
    public String getSchool(){ return school; }
    public void setSchool(String school){ this.school = school; }
    public String getGrade(){ return grade; }
    public void setGrade(String grade){ this.grade = grade; }
    public String getPhotoUrl(){ return photoUrl; }
    public void setPhotoUrl(String photoUrl){ this.photoUrl = photoUrl; }
}
