package blog.panditmandar.code.mvcapp.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import blog.panditmandar.code.mvcapp.model.Student;
import blog.panditmandar.code.mvcapp.service.StudentServiceImpl;

@RestController
@RequestMapping("/api/students")
public class AppController {

	@Autowired
	private StudentServiceImpl studentService;

	// List all students
	@GetMapping
	public List<Student> getAllStudents() {
		return studentService.listAllStudents();
	}

	// Get a single student by ID
	@GetMapping("/{id}")
	public ResponseEntity<Student> getStudent(@PathVariable Long id) {
		Student student = studentService.getStudent(id);
		if (student == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(student);
	}

	// Create a new student
	@PostMapping
	public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) {
		if (student.getGrade() == null) {
			return ResponseEntity.badRequest().body(null);
		}
		Long id = studentService.saveStudent(student);
		student.setId(id);
		return ResponseEntity.ok(student);
	}

	// Update an existing student
	@PutMapping("/{id}")
	public ResponseEntity<Student> updateStudent(@PathVariable Long id, @Valid @RequestBody Student student) {
		if (student.getGrade() == null) {
			return ResponseEntity.badRequest().body(null);
		}
		studentService.update(id, student);
		Student updated = studentService.getStudent(id);
		if (updated == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(updated);
	}

	// Delete a student
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
		Student student = studentService.getStudent(id);
		if (student == null) {
			return ResponseEntity.notFound().build();
		}
		studentService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
