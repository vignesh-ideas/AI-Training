package com.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;

import com.model.Candidate;

import jakarta.persistence.QueryHint;
import java.util.List;

public interface CandidateRepository extends JpaRepository<Candidate, Integer> {
	
	// Optimized query to get vote count - using projection for better performance
	@Query("select c.votes from Candidate c where c.candidate = :candidate")
	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	public Integer getNumOfVotes(@Param("candidate") String candidate);
	
	@Query("select c from Candidate c where c.candidate = :candidate")
	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	public Candidate getCandidateByCandidate(@Param("candidate") String candidate);
	
	// Paginated query for all candidates ordered by votes
	@Query("select c from Candidate c order by c.votes desc")
	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	public Page<Candidate> findAllCandidatesOrderedByVotes(Pageable pageable);
	
	// Get total vote count across all candidates
	@Query("select sum(c.votes) from Candidate c")
	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	public Long getTotalVotes();
	
	// Get candidate with highest votes
	@Query("select c from Candidate c where c.votes = (select max(c2.votes) from Candidate c2)")
	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	public Candidate getCandidateWithHighestVotes();
	
	// Optimized query for vote statistics
	@Query("select c.candidate, c.votes from Candidate c order by c.votes desc")
	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	public List<Object[]> getVoteStatistics();
	
	// Batch update for vote increments (for high concurrency)
	@Query("update Candidate c set c.votes = c.votes + :increment where c.candidate = :candidate")
	public int incrementVotes(@Param("candidate") String candidate, @Param("increment") int increment);
	
	// Get candidates with votes above threshold
	@Query("select c from Candidate c where c.votes >= :threshold order by c.votes desc")
	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	public List<Candidate> getCandidatesWithVotesAbove(@Param("threshold") int threshold);
	
	// Batch operations for performance
	@Query("select c from Candidate c where c.id in :ids")
	public List<Candidate> findCandidatesByIds(@Param("ids") List<Integer> ids);
}
