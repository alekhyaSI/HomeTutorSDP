package com.hometutor.service;

import com.hometutor.entity.StudentProfile;
import com.hometutor.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;

@Service
public class StudentService {
    private final StudentProfileRepository repo;
    public StudentService(StudentProfileRepository repo){ this.repo=repo; }
    public StudentProfile save(StudentProfile s){ return repo.save(s); }
    public StudentProfile get(Long id){
        return repo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "StudentProfile not found"));
    }
    public List<StudentProfile> list(){ return repo.findAll(); }
    public StudentProfile findByUserId(Long userId){ return repo.findByUserId(userId); }
}