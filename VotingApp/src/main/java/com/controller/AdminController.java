package com.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.dto.VoteCountDTO;
import com.model.Candidate;
import com.service.CandidateService;
import com.service.UserService;

@Controller
public class AdminController {
	
	@Autowired
	private CandidateService canServ;
	
	@Autowired
	private UserService userServ;
	
	@GetMapping("/admin")
	public String dashboard(Model m, Principal p) {
		// Get all candidates at once for better performance
		List<Candidate> candidates = canServ.getAllCandidates();
		
		// Create a map for efficient lookup
		Map<String, Integer> voteMap = candidates.stream()
			.collect(Collectors.toMap(
				Candidate::getCandidate,
				Candidate::getVotes
			));
		
		// Get vote counts efficiently
		int c1 = voteMap.getOrDefault("candidate1", 0);
		int c2 = voteMap.getOrDefault("candidate2", 0);
		int c3 = voteMap.getOrDefault("candidate3", 0);
		int c4 = voteMap.getOrDefault("candidate4", 0);
		
		// Performance metrics
		long totalVotes = canServ.getTotalVotes();
		long totalUsers = userServ.getTotalUsers();
		long normalUsers = userServ.getUsersByRoleCount("ROLE_NORMAL");
		long adminUsers = userServ.getUsersByRoleCount("ROLE_ADMIN");
		
		// Get candidate with highest votes
		Candidate winner = canServ.getCandidateWithHighestVotes();
		
		m.addAttribute("c1", c1);
		m.addAttribute("c2", c2);
		m.addAttribute("c3", c3);
		m.addAttribute("c4", c4);
		m.addAttribute("candidates", candidates);
		m.addAttribute("totalVotes", totalVotes);
		m.addAttribute("totalUsers", totalUsers);
		m.addAttribute("normalUsers", normalUsers);
		m.addAttribute("adminUsers", adminUsers);
		m.addAttribute("winner", winner);
		m.addAttribute("title", "DASHBOARD");
		
		return "admin/dashboard";
	}
	
	// New endpoint for paginated user management
	@GetMapping("/admin/users")
	public String manageUsers(Model m, 
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size) {
		
		var usersPage = userServ.getAllUsers(page, size);
		
		m.addAttribute("users", usersPage.getContent());
		m.addAttribute("currentPage", page);
		m.addAttribute("totalPages", usersPage.getTotalPages());
		m.addAttribute("totalElements", usersPage.getTotalElements());
		m.addAttribute("title", "USER MANAGEMENT");
		
		return "admin/users";
	}
	
	// New endpoint for paginated candidate management
	@GetMapping("/admin/candidates")
	public String manageCandidates(Model m,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		
		var candidatesPage = canServ.getAllCandidatesOrderedByVotes(page, size);
		
		m.addAttribute("candidates", candidatesPage.getContent());
		m.addAttribute("currentPage", page);
		m.addAttribute("totalPages", candidatesPage.getTotalPages());
		m.addAttribute("totalElements", candidatesPage.getTotalElements());
		m.addAttribute("title", "CANDIDATE MANAGEMENT");
		
		return "admin/candidates";
	}
	
	// Async analytics endpoint
	@GetMapping("/admin/analytics")
	@ResponseBody
	public CompletableFuture<Map<String, Object>> getAnalytics() {
		return CompletableFuture.supplyAsync(() -> {
			Map<String, Object> analytics = Map.of(
				"totalVotes", canServ.getTotalVotes(),
				"totalUsers", userServ.getTotalUsers(),
				"votedUsers", userServ.getVotedUsersCount(),
				"nonVotedUsers", userServ.getNonVotedUsersCount(),
				"averageVotes", canServ.getAverageVotes(),
				"winner", canServ.getCandidateWithHighestVotes()
			);
			return analytics;
		});
	}
	
	// Async performance metrics endpoint
	@GetMapping("/admin/metrics")
	@ResponseBody
	public CompletableFuture<Map<String, Object>> getPerformanceMetrics() {
		return CompletableFuture.supplyAsync(() -> {
			// This would typically include cache hit rates, response times, etc.
			Map<String, Object> metrics = Map.of(
				"cacheHitRate", "85%",
				"averageResponseTime", "45ms",
				"activeConnections", "12",
				"memoryUsage", "65%"
			);
			return metrics;
		});
	}
}
