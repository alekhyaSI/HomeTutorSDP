package com.hometutor.repository;
import com.hometutor.entity.TutorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface TutorProfileRepository extends JpaRepository<TutorProfile,Long>{
    List<TutorProfile> findBySubjectsContainingIgnoreCase(String subject);
    TutorProfile findByUserId(Long userId);
}
