package kolab.service.impl;

import kolab.dao.CollaborationRepository;
import kolab.domain.Collaboration;
import kolab.service.CollaborationService;
import kolab.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import java.util.List;
import java.util.UUID;

@Service
public class CollaborationServiceJpa implements CollaborationService {
    @Autowired
    private CollaborationRepository collaborationRepo;

    @Override
    public List<Collaboration> getCollaborations() {
        return collaborationRepo.findAll();
    }

    @Override
    public Collaboration getCollaborationById(UUID id) {
        return collaborationRepo.findById(id)
            .orElseThrow(() -> new NotFoundException("Collaboration with id " + id + " not found"));
    }

    @Override
    public List<Collaboration> getCollaborationsByProjectId(UUID projectId) {
        return collaborationRepo.findByProjectId(projectId);
    }

    @Override
    public List<Collaboration> getCollaborationsByCompanyId(UUID companyId) {
        return collaborationRepo.findByCompanyId(companyId);
    }

    @Override
    public List<Collaboration> getCollaborationsByContactId(UUID contactId) {
        return collaborationRepo.findByContactId(contactId);
    }

    @Override
    public List<Collaboration> getCollaborationsByResponsibleId(UUID responsibleId) {
        return collaborationRepo.findByResponsibleId(responsibleId);
    }

    @Override
    public Collaboration createCollaboration(Collaboration collaboration) {
        Assert.notNull(collaboration, "Collaboration object must be given");
        validateCollaboration(collaboration);
        return collaborationRepo.save(collaboration);
    }

    @Override
    public Collaboration updateCollaboration(UUID id, Collaboration updatedCollaboration) {
        Collaboration collaboration = getCollaborationById(id);
        validateCollaboration(updatedCollaboration);

        collaboration.setProject(updatedCollaboration.getProject());
        collaboration.setCompany(updatedCollaboration.getCompany());
        collaboration.setContact(updatedCollaboration.getContact());
        collaboration.setResponsible(updatedCollaboration.getResponsible());
        collaboration.setCategory(updatedCollaboration.getCategory());
        collaboration.setStatus(updatedCollaboration.getStatus());
        collaboration.setComment(updatedCollaboration.getComment());
        collaboration.setAchievedValue(updatedCollaboration.getAchievedValue());

        return collaborationRepo.save(collaboration);
    }

    @Override
    public void deleteCollaboration(UUID id) {
        if (collaborationRepo.existsById(id)) {
            collaborationRepo.deleteById(id);
        } else {
            throw new NotFoundException("Collaboration with id " + id + " not found");
        }
    }

    private void validateCollaboration(Collaboration collaboration) {
        if (collaboration.getProject() == null) {
            throw new IllegalArgumentException("Project is required");
        }
        if (collaboration.getCompany() == null) {
            throw new IllegalArgumentException("Company is required");
        }
        if (collaboration.getCategory() == null || collaboration.getCategory().trim().isEmpty()) {
            throw new IllegalArgumentException("Category is required");
        }
        if (collaboration.getStatus() == null || collaboration.getStatus().trim().isEmpty()) {
            throw new IllegalArgumentException("Status is required");
        }
    }
}