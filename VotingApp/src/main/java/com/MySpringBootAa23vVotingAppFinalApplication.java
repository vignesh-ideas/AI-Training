package com;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.model.Candidate;
import com.model.User;
import com.repository.CandidateRepository;
import com.repository.UserRepository;

@SpringBootApplication
public class MySpringBootAa23vVotingAppFinalApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(MySpringBootAa23vVotingAppFinalApplication.class, args);
	}
	
	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private CandidateRepository canRepo;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Value("${app.admin.email:admin}")
	private String adminEmail;
	
	@Value("${app.admin.password:${ADMIN_PASSWORD:admin}}")
	private String adminPassword;
	
	@Value("${app.admin.name:Administrator}")
	private String adminName;

	@Override
	public void run(String... args) throws Exception {
		try {
			// Check if admin already exists
			if (userRepo.getUserByEmail(adminEmail) == null) {
				User admin = new User();
				admin.setEmail(adminEmail);
				admin.setName(adminName);
				// Use password encoder for secure password storage
				admin.setPassword(passwordEncoder.encode(adminPassword));
				admin.setPhone("1234567890");
				admin.setRole("ROLE_ADMIN");
				admin.setStatus("admin");
				userRepo.save(admin);
			}
			
			// Check if candidates already exist
			if (canRepo.count() == 0) {
				// Candidates
				Candidate candidate1 = new Candidate();
				candidate1.setCandidate("candidate1");
				candidate1.setVotes(0);
				canRepo.save(candidate1);
				
				Candidate candidate2 = new Candidate();
				candidate2.setCandidate("candidate2");
				candidate2.setVotes(0);
				canRepo.save(candidate2);
				
				Candidate candidate3 = new Candidate();
				candidate3.setCandidate("candidate3");
				candidate3.setVotes(0);
				canRepo.save(candidate3);
				
				Candidate candidate4 = new Candidate();
				candidate4.setCandidate("candidate4");
				candidate4.setVotes(0);
				canRepo.save(candidate4);
			}
		} catch (DataIntegrityViolationException e) {
			// Handle duplicate key exceptions gracefully
			System.out.println("Data already exists, skipping initialization");
		} catch (Exception e) {
			System.err.println("Error during application initialization: " + e.getMessage());
		}
	}
}
