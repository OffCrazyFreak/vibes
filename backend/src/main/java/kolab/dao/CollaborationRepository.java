package kolab.dao;

import kolab.domain.Collaboration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface CollaborationRepository extends JpaRepository<Collaboration, UUID> {
    List<Collaboration> findByProjectId(UUID projectId);
    List<Collaboration> findByCompanyId(UUID companyId);
    List<Collaboration> findByContactId(UUID contactId);
    List<Collaboration> findByResponsibleId(UUID responsibleId);
}