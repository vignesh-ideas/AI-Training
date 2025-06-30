package com.controller;

import java.security.Principal;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.exception.DuplicateUserException;
import com.exception.UserNotFoundException;
import com.model.User;
import com.service.UserService;

@Controller
public class UserController {
	
	@Autowired
	private UserService userServ;
	
	@PostMapping("/createuser")
	public String createUser(@Valid @ModelAttribute User user, BindingResult result, HttpSession session) {
		if (result.hasErrors()) {
			session.setAttribute("fail", "Registration Failed: Please check your input data");
			return "redirect:/register";
		}
		
		try {
			userServ.addUser(user);
			session.setAttribute("msg", "Registration successful");
		} catch (DuplicateUserException e) {
			session.setAttribute("fail", e.getMessage());
		} catch (Exception e) {
			session.setAttribute("fail", "Registration failed due to an unexpected error");
		}
		
		return "redirect:/register";
	}
	
	@GetMapping("/user")
	public String dashboard(Model m, Principal p) {
		try {
			String email = p.getName();
			User user = userServ.getUserByEmail(email);
			
			m.addAttribute("user", user);
			m.addAttribute("title", "DASHBOARD");
			
			return "user/dashboard";
		} catch (UserNotFoundException e) {
			m.addAttribute("error", e.getMessage());
			return "error/user-not-found";
		}
	}
}
