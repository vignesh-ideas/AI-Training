package com.ideas2it.legacyappconversion.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ideas2it.legacyappconversion.dao.StudentDaoImpl;
import com.ideas2it.legacyappconversion.model.Student;

@Service
public class StudentServiceImpl {

	@Autowired
	private StudentDaoImpl studentDao;

	public Student getStudent(Long id) {
		return studentDao.getStudent(id);
	}

	public Long saveStudent(Student st) {
		return studentDao.saveStudent(st);
	}

	public List<Student> listAllStudents() {
		return studentDao.listAllStudents();
	}

	public void update(Long id, Student st) {
		Student stEntity = studentDao.getStudent(id);
		if (stEntity != null) {
			stEntity.setFirstName(st.getFirstName());
			stEntity.setLastName(st.getLastName());
			stEntity.setGrade(st.getGrade());
			studentDao.updateStudent(stEntity);
		}
	}

	public void delete(Long id) {
		Student stEntity = studentDao.getStudent(id);
		if (stEntity != null) {
			studentDao.deleteStudent(stEntity);
		}
	}

	public boolean isStudentUnique(Long id) {
		Student student = studentDao.getStudent(id);
		return (student == null || (id != null & !id.equals(student.getId())));
	}

}
