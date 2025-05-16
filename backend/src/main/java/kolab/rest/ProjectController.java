package kolab.rest;

import kolab.domain.Project;
import kolab.service.ProjectService;
import kolab.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping("")
    public ResponseEntity<List<Project>> getProjects() {
        List<Project> projects = projectService.getProjects();
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable UUID id) {
        try {
            Project project = projectService.getProjectById(id);
            return ResponseEntity.ok(project);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Project>> getProjectsByCategoryId(@PathVariable UUID categoryId) {
        List<Project> projects = projectService.getProjectsByCategoryId(categoryId);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/responsible/{responsibleId}")
    public ResponseEntity<List<Project>> getProjectsByResponsibleId(@PathVariable UUID responsibleId) {
        List<Project> projects = projectService.getProjectsByResponsibleId(responsibleId);
        return ResponseEntity.ok(projects);
    }

    @PostMapping("")
    public ResponseEntity<?> createProject(@Valid @RequestBody Project project) {
        try {
            Project createdProject = projectService.createProject(project);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable UUID id, @Valid @RequestBody Project project) {
        try {
            Project updatedProject = projectService.updateProject(id, project);
            return ResponseEntity.ok(updatedProject);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable UUID id) {
        try {
            projectService.deleteProject(id);
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}