package com.ideas2it.legacyappconversion.service;

import com.ideas2it.legacyappconversion.dao.StudentDaoImpl;
import com.ideas2it.legacyappconversion.model.Student;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class StudentServiceImplTest {
    @Mock
    private StudentDaoImpl studentDao;

    @InjectMocks
    private StudentServiceImpl studentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetStudent() {
        Student student = new Student();
        when(studentDao.getStudent(1L)).thenReturn(student);
        assertEquals(student, studentService.getStudent(1L));
    }

    @Test
    void testSaveStudent() {
        Student student = new Student();
        when(studentDao.saveStudent(student)).thenReturn(1L);
        assertEquals(1L, studentService.saveStudent(student));
    }

    @Test
    void testListAllStudents() {
        List<Student> students = Arrays.asList(new Student(), new Student());
        when(studentDao.listAllStudents()).thenReturn(students);
        assertEquals(students, studentService.listAllStudents());
    }

    @Test
    void testUpdate() {
        Student existing = new Student();
        existing.setId(1L);
        Student update = new Student();
        update.setFirstName("A");
        update.setLastName("B");
        update.setGrade(5);
        when(studentDao.getStudent(1L)).thenReturn(existing);
        studentService.update(1L, update);
        verify(studentDao).updateStudent(existing);
        assertEquals("A", existing.getFirstName());
        assertEquals("B", existing.getLastName());
        assertEquals(5, existing.getGrade());
    }

    @Test
    void testDelete() {
        Student student = new Student();
        when(studentDao.getStudent(1L)).thenReturn(student);
        studentService.delete(1L);
        verify(studentDao).deleteStudent(student);
    }

    @Test
    void testIsStudentUnique() {
        when(studentDao.getStudent(1L)).thenReturn(null);
        assertTrue(studentService.isStudentUnique(1L));
        Student student = new Student();
        student.setId(2L);
        when(studentDao.getStudent(1L)).thenReturn(student);
        assertTrue(studentService.isStudentUnique(1L));
        student.setId(1L);
        assertFalse(studentService.isStudentUnique(1L));
    }
} 