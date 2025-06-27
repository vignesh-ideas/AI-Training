package blog.panditmandar.code.mvcapp;

import blog.panditmandar.code.mvcapp.model.Student;

public class TestProvider {
    public static Student sampleStudent() {
        Student student = new Student();
        student.setId(1L);
        student.setFirstName("Test");
        student.setLastName("User");
        student.setGrade(10);
        return student;
    }

    public static Student sampleStudent(Long id, String firstName, String lastName, Integer grade) {
        Student student = new Student();
        student.setId(id);
        student.setFirstName(firstName);
        student.setLastName(lastName);
        student.setGrade(grade);
        return student;
    }
} 