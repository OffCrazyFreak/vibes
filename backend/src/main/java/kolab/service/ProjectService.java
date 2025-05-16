package kolab.service;

import kolab.domain.Project;
import java.util.List;
import java.util.UUID;

public interface ProjectService {
    List<Project> getProjects();
    Project getProjectById(UUID id);
    List<Project> getProjectsByCategoryId(UUID categoryId);
    List<Project> getProjectsByResponsibleId(UUID responsibleId);
    Project createProject(Project project);
    Project updateProject(UUID id, Project project);
    void deleteProject(UUID id);
}