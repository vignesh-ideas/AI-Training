package com.ideas2it.legacyappconversion.controller;

import com.ideas2it.legacyappconversion.model.Student;
import com.ideas2it.legacyappconversion.service.StudentServiceImpl;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(com.ideas2it.legacyappconversion.controller.AppController.class)
class AppControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentServiceImpl studentService;

    @Test
    void testGetAllStudents() throws Exception {
        List<Student> students = Arrays.asList(new Student(), new Student());
        when(studentService.listAllStudents()).thenReturn(students);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void testGetStudentById() throws Exception {
        Student student = new Student();
        when(studentService.getStudent(1L)).thenReturn(student);
        mockMvc.perform(MockMvcRequestBuilders.get("/api/students/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    void testCreateStudent() throws Exception {
        Student student = new Student();
        student.setGrade(10);
        when(studentService.saveStudent(any(Student.class))).thenReturn(1L);
        mockMvc.perform(MockMvcRequestBuilders.post("/api/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"firstName\":\"John\",\"lastName\":\"Doe\",\"grade\":10}"))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateStudent() throws Exception {
        Student student = new Student();
        student.setGrade(10);
        when(studentService.getStudent(1L)).thenReturn(student);
        mockMvc.perform(MockMvcRequestBuilders.put("/api/students/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"firstName\":\"John\",\"lastName\":\"Doe\",\"grade\":10}"))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteStudent() throws Exception {
        Student student = new Student();
        when(studentService.getStudent(1L)).thenReturn(student);
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/students/1"))
                .andExpect(status().isNoContent());
    }
} 