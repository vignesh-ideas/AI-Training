package blog.panditmandar.code.mvcapp.dao;

import blog.panditmandar.code.mvcapp.model.Student;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class StudentDaoImplTest {
    @Mock
    private EntityManager entityManager;
    @Mock
    private TypedQuery<Student> query;
    @InjectMocks
    private StudentDaoImpl studentDao;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testListAllStudents() {
        List<Student> students = Arrays.asList(new Student(), new Student());
        when(entityManager.createQuery(anyString(), eq(Student.class))).thenReturn(query);
        when(query.getResultList()).thenReturn(students);
        List<Student> result = studentDao.listAllStudents();
        assertEquals(2, result.size());
    }

    @Test
    void testGetStudent() {
        Student student = new Student();
        when(entityManager.find(Student.class, 1L)).thenReturn(student);
        assertEquals(student, studentDao.getStudent(1L));
    }

    @Test
    void testSaveStudent() {
        Student student = new Student();
        doNothing().when(entityManager).persist(student);
        student.setId(1L);
        assertEquals(1L, studentDao.saveStudent(student));
    }

    @Test
    void testUpdateStudent() {
        Student student = new Student();
        when(entityManager.merge(student)).thenReturn(student);
        studentDao.updateStudent(student);
        verify(entityManager).merge(student);
    }

    @Test
    void testDeleteStudent() {
        Student student = new Student();
        when(entityManager.contains(student)).thenReturn(true);
        doNothing().when(entityManager).remove(student);
        studentDao.deleteStudent(student);
        verify(entityManager).remove(student);
    }
} 