package com.hometutor.repository;
import com.hometutor.entity.User;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface UserRepository extends JpaRepository<User,Long>{
    Optional<User> findByEmail(String email);
    List<User> findByStatus(User.ApprovalStatus status);
    
    Optional<User> findById(Long id);

}