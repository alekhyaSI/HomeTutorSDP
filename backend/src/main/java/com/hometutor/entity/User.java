package com.hometutor.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="users")
public class User {

    public enum Role { ADMIN, TUTOR, STUDENT }
    public enum ApprovalStatus { PENDING, APPROVED, REJECTED }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;
    
    // basic profile info
    private String name;
    private String phone;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private ApprovalStatus status = ApprovalStatus.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId(){ return id; }
    public String getEmail(){ return email; }
    public void setEmail(String email){ this.email=email; }
    public String getPassword(){ return password; }
    public void setPassword(String password){ this.password=password; }
    public Role getRole(){ return role; }
    public void setRole(Role role){ this.role=role; }
    public String getName(){ return name; }
    public void setName(String name){ this.name = name; }
    public String getPhone(){ return phone; }
    public void setPhone(String phone){ this.phone = phone; }
    public ApprovalStatus getStatus(){ return status; }
    public void setStatus(ApprovalStatus status){ this.status=status; }
    public LocalDateTime getCreatedAt(){ return createdAt; }
    public void setCreatedAt(LocalDateTime t){ this.createdAt=t; }
}
