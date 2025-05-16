package kolab.dao;

import kolab.domain.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findByCategoryId(UUID categoryId);
    List<Project> findByResponsibleId(UUID responsibleId);
    boolean existsByName(String name);
}