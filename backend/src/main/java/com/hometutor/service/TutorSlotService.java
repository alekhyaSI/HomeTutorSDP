package com.hometutor.service;

import com.hometutor.entity.TutorSlot;
import com.hometutor.entity.TutorProfile;
import com.hometutor.repository.TutorSlotRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TutorSlotService {
    private final TutorSlotRepository repo;
    public TutorSlotService(TutorSlotRepository repo){ this.repo = repo; }
    public TutorSlot save(TutorSlot s){ return repo.save(s); }
    public List<TutorSlot> findByTutor(TutorProfile t){ return repo.findByTutor(t); }
    public List<TutorSlot> findOpen(){ return repo.findByOpenTrue(); }
    public TutorSlot get(Long id){ return repo.findById(id).orElseThrow(() -> new RuntimeException("Slot not found")); }
    public void delete(Long id){ repo.deleteById(id); }
}
