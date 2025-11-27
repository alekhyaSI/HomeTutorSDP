package com.hometutor.repository;
import com.hometutor.entity.StudentProfile;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile,Long>{
	StudentProfile findByUserId(Long userId);
}
