package com.hometutor.repository;

import com.hometutor.entity.TutorSlot;
import com.hometutor.entity.TutorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TutorSlotRepository extends JpaRepository<TutorSlot, Long> {
    List<TutorSlot> findByTutor(TutorProfile tutor);
    List<TutorSlot> findByOpenTrue();
}
