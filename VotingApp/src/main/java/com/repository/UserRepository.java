package com.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;

import com.model.User;

import jakarta.persistence.QueryHint;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
	
	@Query("select v from User v where v.email = :email")
	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	public User getUserByEmail(@Param("email") String email);
	
	// Paginated query for all users with optimized ordering
	@Query("select u from User u order by u.id")
	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	public Page<User> findAllUsers(Pageable pageable);
	
	// Paginated query for users by role with index optimization
	@Query("select u from User u where u.role = :role order by u.id")
	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	public Page<User> findUsersByRole(@Param("role") String role, Pageable pageable);
	
	// Count users by role for performance metrics
	@Query("select count(u) from User u where u.role = :role")
	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	public long countUsersByRole(@Param("role") String role);
	
	// Optimized query for users by status (for voting analytics)
	@Query("select u from User u where u.status = :status")
	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	public List<User> findUsersByStatus(@Param("status") String status);
	
	// Composite query for user search
	@Query("select u from User u where u.role = :role and u.status = :status")
	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	public List<User> findUsersByRoleAndStatus(@Param("role") String role, @Param("status") String status);
	
	// Optimized query for user count by status
	@Query("select count(u) from User u where u.status = :status")
	@QueryHints(@QueryHint(name = org.hibernate.annotations.QueryHints.CACHEABLE, value = "true"))
	public long countUsersByStatus(@Param("status") String status);
	
	// Batch operations for performance
	@Query("select u from User u where u.id in :ids")
	public List<User> findUsersByIds(@Param("ids") List<Integer> ids);
}
