package com.hometutor.controller;

import com.hometutor.entity.TutorSlot;
import com.hometutor.service.TutorSlotService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestController
@RequestMapping("/api/slot")
public class SlotController {
    private final TutorSlotService slotService;
    public SlotController(TutorSlotService slotService){ this.slotService = slotService; }

    @GetMapping("/available")
    public List<TutorSlot> available(){
        return slotService.findOpen();
    }
}
