package kolab.service.impl;

import kolab.dao.ProjectRepository;
import kolab.domain.Project;
import kolab.service.ProjectService;
import kolab.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import java.util.List;
import java.util.UUID;

@Service
public class ProjectServiceJpa implements ProjectService {
    @Autowired
    private ProjectRepository projectRepo;

    @Override
    public List<Project> getProjects() {
        return projectRepo.findAll();
    }

    @Override
    public Project getProjectById(UUID id) {
        return projectRepo.findById(id)
            .orElseThrow(() -> new NotFoundException("Project with id " + id + " not found"));
    }

    @Override
    public List<Project> getProjectsByCategoryId(UUID categoryId) {
        return projectRepo.findByCategoryId(categoryId);
    }

    @Override
    public List<Project> getProjectsByResponsibleId(UUID responsibleId) {
        return projectRepo.findByResponsibleId(responsibleId);
    }

    @Override
    public Project createProject(Project project) {
        Assert.notNull(project, "Project object must be given");
        if (projectRepo.existsByName(project.getName())) {
            throw new IllegalArgumentException("Project with name " + project.getName() + " already exists");
        }
        validateProject(project);
        return projectRepo.save(project);
    }

    @Override
    public Project updateProject(UUID id, Project updatedProject) {
        Project project = getProjectById(id);
        validateProject(updatedProject);

        if (!project.getName().equals(updatedProject.getName()) && 
            projectRepo.existsByName(updatedProject.getName())) {
            throw new IllegalArgumentException("Project with name " + updatedProject.getName() + " already exists");
        }

        project.setCategory(updatedProject.getCategory());
        project.setName(updatedProject.getName());
        project.setType(updatedProject.getType());
        project.setStartDate(updatedProject.getStartDate());
        project.setEndDate(updatedProject.getEndDate());
        project.setGoal(updatedProject.getGoal());
        project.setResponsible(updatedProject.getResponsible());

        return projectRepo.save(project);
    }

    @Override
    public void deleteProject(UUID id) {
        if (projectRepo.existsById(id)) {
            projectRepo.deleteById(id);
        } else {
            throw new NotFoundException("Project with id " + id + " not found");
        }
    }

    private void validateProject(Project project) {
        if (project.getName() == null || project.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (project.getType() == null || project.getType().trim().isEmpty()) {
            throw new IllegalArgumentException("Type is required");
        }
        if (project.getStartDate() == null) {
            throw new IllegalArgumentException("Start date is required");
        }
        if (project.getCategory() == null) {
            throw new IllegalArgumentException("Category is required");
        }
        if (project.getResponsible() == null) {
            throw new IllegalArgumentException("Responsible user is required");
        }
    }
}