package com.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
@Table(name = "candidates", indexes = {
    @Index(name = "idx_candidate_name", columnList = "candidate"),
    @Index(name = "idx_candidate_votes", columnList = "votes"),
    @Index(name = "idx_candidate_name_votes", columnList = "candidate, votes")
})
public class Candidate {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(unique = true, length = 100)
	@NotBlank(message = "Candidate name is required")
	private String candidate;
	
	@Column(length = 10)
	@Min(value = 0, message = "Votes cannot be negative")
	private int votes;
}
