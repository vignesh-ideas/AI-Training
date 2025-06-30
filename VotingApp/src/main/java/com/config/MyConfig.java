package com.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;

@Configuration
@EnableWebSecurity
public class MyConfig {
	
	@Autowired
	private AuthenticationSuccessHandler customSuccessHandler;
	
	@Bean
	public UserDetailsService getUserDetailsService() {
		return new UserDetailsServiceImpl();
	}
	
	@Bean 
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(12); // Use BCrypt with strength 12
	}
	
	@Bean
	public DaoAuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
		daoAuthenticationProvider.setUserDetailsService(this.getUserDetailsService());
		daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
		return daoAuthenticationProvider;
	}
	
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			.authenticationProvider(authenticationProvider())
			.authorizeHttpRequests(authz -> authz
				.requestMatchers("/admin/**").hasRole("ADMIN")
				.requestMatchers("/user/**", "/candidate/**").hasRole("NORMAL")
				.requestMatchers("/**").permitAll()
			)
			.formLogin(form -> form
				.loginPage("/signin")
				.loginProcessingUrl("/dologin")
				.successHandler(customSuccessHandler)
				.failureUrl("/signin?error=true")
			)
			.logout(logout -> logout
				.logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
				.logoutSuccessUrl("/")
				.invalidateHttpSession(true)
				.deleteCookies("JSESSIONID")
			)
			.csrf(csrf -> csrf
				.ignoringRequestMatchers("/api/**") // Only if needed for API endpoints
			)
			.headers(headers -> headers
				.frameOptions().deny() // Prevent clickjacking
				.contentTypeOptions().and() // Prevent MIME type sniffing
				.httpStrictTransportSecurity(hstsConfig -> hstsConfig
					.maxAgeInSeconds(31536000)
				)
				.referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
			)
			.sessionManagement(session -> session
				.maximumSessions(1)
				.expiredUrl("/signin?expired=true")
			);
		
		return http.build();
	}
}
