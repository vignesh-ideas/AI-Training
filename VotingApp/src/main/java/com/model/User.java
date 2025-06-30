package com.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Index;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

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
@Table(name = "users", indexes = {
    @Index(name = "idx_user_email", columnList = "email"),
    @Index(name = "idx_user_role", columnList = "role"),
    @Index(name = "idx_user_status", columnList = "status"),
    @Index(name = "idx_user_role_status", columnList = "role, status"),
    @Index(name = "idx_user_email_role", columnList = "email, role")
})
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(unique=true, length = 255)
	@Email(message = "Please provide a valid email address")
	@NotBlank(message = "Email is required")
	@Size(max = 255, message = "Email must not exceed 255 characters")
	@Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", 
	         message = "Please provide a valid email format")
	private String email;
	
	@Column(length = 100)
	@NotBlank(message = "Name is required")
	@Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
	@Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Name can only contain letters and spaces")
	private String name;
	
	@Column(length = 255)
	@NotBlank(message = "Password is required")
	@Size(min = 8, max = 255, message = "Password must be between 8 and 255 characters")
	@Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$", 
	         message = "Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character")
	private String password;
	
	@Column(length = 20)
	@NotNull(message = "Phone number is required")
	@Pattern(regexp = "^\\d{10,15}$", message = "Phone number must be between 10 and 15 digits")
	private String phone;
	
	@Column(length = 50)
	@Size(max = 50, message = "Status must not exceed 50 characters")
	private String status;
	
	@Column(length = 20)
	@Size(max = 20, message = "Role must not exceed 20 characters")
	@Pattern(regexp = "^(ROLE_ADMIN|ROLE_NORMAL)$", message = "Invalid role")
	private String role;
}
