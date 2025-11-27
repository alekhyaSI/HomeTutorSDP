package com.hometutor.service;

import com.hometutor.entity.User;
import com.hometutor.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    private final UserRepository repo;
    public UserService(UserRepository repo){ this.repo=repo; }
    public User register(User u){ return repo.save(u); }
    public List<User> list(){ return repo.findAll(); }
    public List<User> listPending(){ return repo.findByStatus(User.ApprovalStatus.PENDING); }
    public User approve(Long id){ User u=repo.findById(id).orElseThrow(); u.setStatus(User.ApprovalStatus.APPROVED); return repo.save(u); }
    public User reject(Long id){ User u=repo.findById(id).orElseThrow(); u.setStatus(User.ApprovalStatus.REJECTED); return repo.save(u); }
    public void delete(Long id){ repo.deleteById(id); }

    public User get(Long id){ return repo.findById(id).orElseThrow(); }
    public User save(User u){ return repo.save(u); }
}