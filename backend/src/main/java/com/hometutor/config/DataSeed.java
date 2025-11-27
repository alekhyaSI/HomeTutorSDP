package com.hometutor.config;

import com.hometutor.entity.User;
import com.hometutor.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeed {

    @Bean
    CommandLineRunner createAdminIfMissing(UserRepository userRepository){
        return args -> {
            String adminEmail = "admin@example.com";
            userRepository.findByEmail(adminEmail).ifPresentOrElse(u -> {
                // already exists
            }, () -> {
                User u = new User();
                u.setEmail(adminEmail);
                u.setPassword("adminpass"); // demo only
                u.setRole(User.Role.ADMIN);
                u.setStatus(User.ApprovalStatus.APPROVED);
                u.setName("Administrator");
                userRepository.save(u);
                System.out.println("[DataSeed] Created admin user: " + adminEmail + " / adminpass (demo)");
            });
        };
    }
}
