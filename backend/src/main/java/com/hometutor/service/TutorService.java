package com.hometutor.service;

import com.hometutor.entity.TutorProfile;
import com.hometutor.repository.TutorProfileRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TutorService {
    private final TutorProfileRepository repo;
    public TutorService(TutorProfileRepository repo){ this.repo=repo; }
    public TutorProfile save(TutorProfile t){ return repo.save(t); }
    public TutorProfile get(Long id){
        return repo.findById(id).orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "TutorProfile not found"));
    }
    public List<TutorProfile> list(){ return repo.findAll(); }
    public TutorProfile findByUserId(Long userId){ return repo.findByUserId(userId); }
    public List<TutorProfile> search(String subject, String day, Double maxCost){
        List<TutorProfile> result = subject==null || subject.isBlank() ? repo.findAll() : repo.findBySubjectsContainingIgnoreCase(subject);
        if(day!=null && !day.isBlank()){
            String d = day.toLowerCase();
            result = result.stream().filter(t -> t.getAvailableDays()!=null && t.getAvailableDays().toLowerCase().contains(d)).collect(Collectors.toList());
        }
        if(maxCost!=null){
            Double m = maxCost;
            result = result.stream().filter(t -> t.getRatePerHour()!=null && t.getRatePerHour() <= m).collect(Collectors.toList());
        }
        return result;
    }
}