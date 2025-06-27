package com.ideas2it.legacyappconversion.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class StudentTest {
    @Test
    void testGettersAndSetters() {
        Student student = new Student();
        student.setId(1L);
        student.setFirstName("John");
        student.setLastName("Doe");
        student.setGrade(10);

        assertEquals(1L, student.getId());
        assertEquals("John", student.getFirstName());
        assertEquals("Doe", student.getLastName());
        assertEquals(10, student.getGrade());
    }

    @Test
    void testGetName() {
        Student student = new Student();
        student.setFirstName("Jane");
        student.setLastName("Smith");
        assertEquals("Jane Smith", student.getName());
    }
} 