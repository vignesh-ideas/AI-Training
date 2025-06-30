package com.controller;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.Map;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.exception.CandidateNotFoundException;
import com.exception.UserNotFoundException;
import com.exception.VotingException;
import com.model.Candidate;
import com.model.User;
import com.service.CandidateService;
import com.service.UserService;

@Controller
public class CandidateController {
	
	@Autowired
	private CandidateService canServ;
	
	@Autowired
	private UserService userServ;
	
	private static final List<String> VALID_CANDIDATES = Arrays.asList("candidate1", "candidate2", "candidate3", "candidate4");
	
	@PostMapping("/addcandidate")
	@Transactional
	public String addCandidate(@RequestParam("candidate") String candidate,
			Principal p, Model model, HttpSession session) {
		
		// Input validation
		if (candidate == null || candidate.trim().isEmpty() || !VALID_CANDIDATES.contains(candidate)) {
			session.setAttribute("vmsg", "Invalid candidate selection");
			return "redirect:/user/";
		}
		
		try {
			String email = p.getName();
			User user = userServ.getUserByEmail(email);
			
			if(user.getStatus() == null) {
				// Use optimized vote increment for better concurrency
				int updatedRows = canServ.incrementVotes(candidate, 1);
				
				if (updatedRows > 0) {
					// Update user status
					user.setStatus("Voted");
					userServ.addUser(user);
					
					session.setAttribute("vmsg", "Successfully Voted...");
				} else {
					session.setAttribute("vmsg", "Voting failed - candidate not found");
				}
			} else {
				session.setAttribute("vmsg", "You have already voted");
			}
		} catch (UserNotFoundException e) {
			session.setAttribute("vmsg", "User not found: " + e.getMessage());
		} catch (CandidateNotFoundException e) {
			session.setAttribute("vmsg", "Candidate not found: " + e.getMessage());
		} catch (VotingException e) {
			session.setAttribute("vmsg", "Voting error: " + e.getMessage());
		} catch (Exception e) {
			session.setAttribute("vmsg", "Something went wrong during voting process");
		}
		
		return "redirect:/user/";
	}
	
	// Async endpoint for vote statistics
	@GetMapping("/api/vote-statistics")
	@ResponseBody
	public CompletableFuture<Map<String, Object>> getVoteStatistics() {
		return CompletableFuture.supplyAsync(() -> {
			try {
				List<Candidate> candidates = canServ.getAllCandidates();
				Map<String, Object> statistics = Map.of(
					"totalCandidates", candidates.size(),
					"totalVotes", canServ.getTotalVotes(),
					"averageVotes", canServ.getAverageVotes(),
					"candidates", candidates
				);
				return statistics;
			} catch (Exception e) {
				throw new RuntimeException("Failed to get vote statistics", e);
			}
		});
	}
	
	// Async endpoint for candidate details
	@GetMapping("/api/candidate/{candidateName}")
	@ResponseBody
	public CompletableFuture<Candidate> getCandidateDetails(@RequestParam String candidateName) {
		return CompletableFuture.supplyAsync(() -> {
			try {
				return canServ.getCandidateByCandidate(candidateName);
			} catch (CandidateNotFoundException e) {
				throw new RuntimeException("Candidate not found: " + candidateName, e);
			}
		});
	}
}
