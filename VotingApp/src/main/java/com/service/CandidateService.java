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

import com.exception.CandidateNotFoundException;
import com.exception.VotingException;
import com.model.Candidate;
import com.repository.CandidateRepository;

@Service
@Transactional
public class CandidateService {
	
	@Autowired
	private CandidateRepository canRepo;
	
	@CacheEvict(value = {"candidates", "voteCounts", "analytics"}, allEntries = true)
	public Candidate addCandidate(Candidate can)
	{
		
		return this.canRepo.save(can);
	}
	
	// Paginated method for getting all candidates ordered by votes
	@Cacheable("candidates")
	public Page<Candidate> getAllCandidatesOrderedByVotes(int page, int size)
	{
		Pageable pageable = PageRequest.of(page, size, Sort.by("votes").descending());
		return this.canRepo.findAllCandidatesOrderedByVotes(pageable);
	}
	
	// Legacy method for backward compatibility
	@Cacheable("candidates")
	public List<Candidate> getAllCandidates()
	{
		return this.canRepo.findAll();
	}
	
	@Cacheable("candidate")
	public Candidate getCandidateById(int id)
	{
		Optional<Candidate> candidate = this.canRepo.findById(id);
		if (candidate.isEmpty()) {
			throw new CandidateNotFoundException("Candidate not found with ID: " + id);
		}
		return candidate.get();
	}
	
	@CacheEvict(value = {"candidates", "candidate", "voteCounts"}, allEntries = true)
	public void deleteCandidate(int id)
	{
		if (!this.canRepo.existsById(id)) {
			throw new CandidateNotFoundException("Candidate not found with ID: " + id);
		}
		this.canRepo.deleteById(id);
	}
	
	@Cacheable("voteCounts")
	public Integer getNumOfVotes(String candidate)
	{
		Integer votes = this.canRepo.getNumOfVotes(candidate);
		return votes != null ? votes : 0;
	}

	@Cacheable("candidate")
	public Candidate getCandidateByCandidate(String candidate)
	{
		Candidate candidateEntity = this.canRepo.getCandidateByCandidate(candidate);
		if (candidateEntity == null) {
			throw new CandidateNotFoundException("Candidate not found: " + candidate);
		}
		return candidateEntity;
	}
	
	// Performance metrics and analytics
	@Cacheable("voteCounts")
	public Long getTotalVotes()
	{
		Long total = this.canRepo.getTotalVotes();
		return total != null ? total : 0L;
	}
	
	@Cacheable("candidates")
	public Candidate getCandidateWithHighestVotes()
	{
		return this.canRepo.getCandidateWithHighestVotes();
	}
	
	// Optimized method to get vote counts for all candidates at once
	@Cacheable("voteCounts")
	public List<Object[]> getVoteCountsForAllCandidates()
	{
		return this.canRepo.findAll().stream()
			.map(c -> new Object[]{c.getCandidate(), c.getVotes()})
			.toList();
	}
	
	// Async methods for heavy operations
	@Async("analyticsExecutor")
	public CompletableFuture<Long> getTotalVotesAsync() {
		return CompletableFuture.completedFuture(getTotalVotes());
	}
	
	@Async("analyticsExecutor")
	public CompletableFuture<Candidate> getCandidateWithHighestVotesAsync() {
		return CompletableFuture.completedFuture(getCandidateWithHighestVotes());
	}
	
	@Async("taskExecutor")
	public CompletableFuture<List<Object[]>> getVoteStatisticsAsync() {
		return CompletableFuture.completedFuture(this.canRepo.getVoteStatistics());
	}
	
	// Batch operations for performance
	@Async("taskExecutor")
	public CompletableFuture<List<Candidate>> getCandidatesByIdsAsync(List<Integer> ids) {
		return CompletableFuture.completedFuture(this.canRepo.findCandidatesByIds(ids));
	}
	
	// High-performance vote increment (for concurrent voting)
	@CacheEvict(value = {"voteCounts", "candidates"}, allEntries = true)
	public int incrementVotes(String candidate, int increment) {
		try {
			int updatedRows = this.canRepo.incrementVotes(candidate, increment);
			if (updatedRows == 0) {
				throw new VotingException("Failed to increment votes for candidate: " + candidate);
			}
			return updatedRows;
		} catch (Exception e) {
			throw new VotingException("Error incrementing votes for candidate: " + candidate, e);
		}
	}
	
	// Advanced analytics
	@Cacheable("analytics")
	public List<Candidate> getCandidatesWithVotesAbove(int threshold) {
		return this.canRepo.getCandidatesWithVotesAbove(threshold);
	}
	
	@Async("analyticsExecutor")
	public CompletableFuture<List<Candidate>> getCandidatesWithVotesAboveAsync(int threshold) {
		return CompletableFuture.completedFuture(getCandidatesWithVotesAbove(threshold));
	}
	
	// Vote distribution analytics
	@Cacheable("analytics")
	public double getAverageVotes() {
		List<Candidate> candidates = getAllCandidates();
		if (candidates.isEmpty()) return 0.0;
		
		double totalVotes = candidates.stream()
			.mapToInt(Candidate::getVotes)
			.sum();
		
		return totalVotes / candidates.size();
	}
	
	@Async("analyticsExecutor")
	public CompletableFuture<Double> getAverageVotesAsync() {
		return CompletableFuture.completedFuture(getAverageVotes());
	}
}
