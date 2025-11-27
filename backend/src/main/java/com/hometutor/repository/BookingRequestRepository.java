package com.hometutor.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hometutor.entity.BookingRequest;
import com.hometutor.entity.StudentProfile;
import com.hometutor.entity.TutorProfile;
public interface BookingRequestRepository extends JpaRepository<BookingRequest,Long>{
    List<BookingRequest> findByTutor(TutorProfile tutor);
    List<BookingRequest> findByStudent(StudentProfile student);
    
    @Query("SELECT br.status, COUNT(br) FROM BookingRequest br GROUP BY br.status")
    List<Object[]> countByStatus();

    @Query("SELECT br.status, COUNT(br) FROM BookingRequest br WHERE br.user.id = :userId GROUP BY br.status")
    List<Object[]> countStatusByUser(Long userId);

    List<BookingRequest> findByUser_Id(Long userId);



}