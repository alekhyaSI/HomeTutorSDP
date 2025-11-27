package com.hometutor.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.hometutor.entity.BookingRequest;
import com.hometutor.repository.BookingRequestRepository;

@Service
public class BookingService {
    private final BookingRequestRepository repo;
    private final TutorSlotService slotService;
    public BookingService(BookingRequestRepository repo, TutorSlotService slotService){ this.repo=repo; this.slotService = slotService; }
    public BookingRequest create(BookingRequest b){ return repo.save(b); }
    public BookingRequest approve(Long id){ BookingRequest br=repo.findById(id).orElseThrow(); br.setStatus(BookingRequest.Status.APPROVED); return repo.save(br); }
    public BookingRequest reject(Long id){ 
        BookingRequest br=repo.findById(id).orElseThrow(); 
        br.setStatus(BookingRequest.Status.REJECTED); 
        // reopen the slot if linked
        if(br.getSlotId()!=null){
            try{
                com.hometutor.entity.TutorSlot s = slotService.get(br.getSlotId());
                s.setOpen(true);
                slotService.save(s);
            }catch(Exception ex){ /* ignore */ }
        }
        return repo.save(br); 
    }
    public List<BookingRequest> all(){ return repo.findAll(); }
    public BookingRequest get(Long id){ return repo.findById(id).orElseThrow(); }
    
    public Map<String, Long> getStatusCounts() {
        List<Object[]> rows = repo.countByStatus();
        Map<String, Long> map = new HashMap<>();

        for (Object[] row : rows) {
            String status = row[0].toString();  // APPROVED, PENDING, etc.
            Long count = (Long) row[1];
            map.put(status, count);
        }

        return map;
    }
    
    public Map<String, Long> getStatusCountsForUser(Long userId) {
        List<Object[]> rows = repo.countStatusByUser(userId);
        Map<String, Long> map = new HashMap<>();

        for (Object[] row : rows) {
            String status = row[0].toString();
            Long count = (Long) row[1];
            map.put(status, count);
        }

        return map;
    }
 
    
    public List<BookingRequest> findByUserId(Long userId) {
        return repo.findByUser_Id(userId);
    }


}