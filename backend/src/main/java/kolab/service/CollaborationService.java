package kolab.service;

import kolab.domain.Collaboration;
import java.util.List;
import java.util.UUID;

public interface CollaborationService {
    List<Collaboration> getCollaborations();
    Collaboration getCollaborationById(UUID id);
    List<Collaboration> getCollaborationsByProjectId(UUID projectId);
    List<Collaboration> getCollaborationsByCompanyId(UUID companyId);
    List<Collaboration> getCollaborationsByContactId(UUID contactId);
    List<Collaboration> getCollaborationsByResponsibleId(UUID responsibleId);
    Collaboration createCollaboration(Collaboration collaboration);
    Collaboration updateCollaboration(UUID id, Collaboration collaboration);
    void deleteCollaboration(UUID id);
}