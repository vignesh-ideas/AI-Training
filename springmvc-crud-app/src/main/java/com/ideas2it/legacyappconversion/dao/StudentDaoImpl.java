package com.ideas2it.legacyappconversion.dao;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.ideas2it.legacyappconversion.model.Student;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

/**
 * Student Dao Implementation for Simple Spring MVC CRUD App
 * 
 * @author Mandar Pandit
 */
@Repository
@Transactional
public class StudentDaoImpl {

	@PersistenceContext
	private EntityManager entityManager;

	public Student getStudent(Long id) {
		return entityManager.find(Student.class, id);
	}

	public Long saveStudent(Student st) {
		entityManager.persist(st);
		return st.getId();
	}

	public void updateStudent(Student st) {
		entityManager.merge(st);
	}

	public void deleteStudent(Student st) {
		entityManager.remove(entityManager.contains(st) ? st : entityManager.merge(st));
	}

	public List<Student> listAllStudents() {
		return entityManager.createQuery("SELECT s FROM Student s", Student.class).getResultList();
	}

}
