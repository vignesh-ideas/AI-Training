package com.service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.exception.DuplicateUserException;
import com.exception.UserNotFoundException;
import com.model.Candidate;
import com.model.User;
import com.repository.CandidateRepository;
import com.repository.UserRepository;

@Service
@Transactional
public class UserService {
	
	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private CandidateRepository canRepo;
	
	@CacheEvict(value = {"users", "userCounts"}, allEntries = true)
	public User addUser(User user) {
		// Check for duplicate email
		if (userRepo.getUserByEmail(user.getEmail()) != null) {
			throw new DuplicateUserException("User with email " + user.getEmail() + " already exists");
		}
		
		user.setRole("ROLE_NORMAL");
		return this.userRepo.save(user);
	}
	
	// Paginated method for getting all users
	@Cacheable("users")
	public Page<User> getAllUsers(int page, int size) {
		Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
		return this.userRepo.findAllUsers(pageable);
	}
	
	// Legacy method for backward compatibility
	@Cacheable("users")
	public List<User> getAllUsers() {
		return this.userRepo.findAll();
	}
	
	// Paginated method for getting users by role
	@Cacheable("users")
	public Page<User> getUsersByRole(String role, int page, int size) {
		Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
		return this.userRepo.findUsersByRole(role, pageable);
	}
	
	@Cacheable("user")
	public User getUserById(int id) {
		Optional<User> user = this.userRepo.findById(id);
		if (user.isEmpty()) {
			throw new UserNotFoundException("User not found with ID: " + id);
		}
		return user.get();
	}
	
	@CacheEvict(value = {"users", "user"}, allEntries = true)
	public void deleteUser(int id) {
		if (!this.userRepo.existsById(id)) {
			throw new UserNotFoundException("User not found with ID: " + id);
		}
		this.userRepo.deleteById(id);
	}
	
	@Cacheable("user")
	public User getUserByEmail(String email) {
		User user = this.userRepo.getUserByEmail(email);
		if (user == null) {
			throw new UserNotFoundException("User not found with email: " + email);
		}
		return user;
	}
	
	// Performance metrics - cached for 5 minutes
	@Cacheable("userCounts")
	public long getTotalUsers() {
		return this.userRepo.count();
	}
	
	@Cacheable("userCounts")
	public long getUsersByRoleCount(String role) {
		return this.userRepo.countUsersByRole(role);
	}
	
	// Async methods for heavy operations
	@Async("analyticsExecutor")
	public CompletableFuture<Long> getTotalUsersAsync() {
		return CompletableFuture.completedFuture(this.userRepo.count());
	}
	
	@Async("analyticsExecutor")
	public CompletableFuture<Long> getUsersByRoleCountAsync(String role) {
		return CompletableFuture.completedFuture(this.userRepo.countUsersByRole(role));
	}
	
	@Async("taskExecutor")
	public CompletableFuture<List<User>> getUsersByStatusAsync(String status) {
		return CompletableFuture.completedFuture(this.userRepo.findUsersByStatus(status));
	}
	
	// Batch operations for performance
	@Async("taskExecutor")
	public CompletableFuture<List<User>> getUsersByIdsAsync(List<Integer> ids) {
		return CompletableFuture.completedFuture(this.userRepo.findUsersByIds(ids));
	}
	
	// Advanced analytics
	@Cacheable("analytics")
	public long getVotedUsersCount() {
		return this.userRepo.countUsersByStatus("Voted");
	}
	
	@Cacheable("analytics")
	public long getNonVotedUsersCount() {
		return this.userRepo.countUsersByStatus(null);
	}
	
	@Async("analyticsExecutor")
	public CompletableFuture<Long> getVotedUsersCountAsync() {
		return CompletableFuture.completedFuture(getVotedUsersCount());
	}
}
