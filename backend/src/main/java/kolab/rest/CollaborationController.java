package kolab.rest;

import kolab.domain.Collaboration;
import kolab.service.CollaborationService;
import kolab.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/collaborations")
public class CollaborationController {

    @Autowired
    private CollaborationService collaborationService;

    @GetMapping("")
    public ResponseEntity<List<Collaboration>> getCollaborations() {
        List<Collaboration> collaborations = collaborationService.getCollaborations();
        return ResponseEntity.ok(collaborations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCollaborationById(@PathVariable UUID id) {
        try {
            Collaboration collaboration = collaborationService.getCollaborationById(id);
            return ResponseEntity.ok(collaboration);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Collaboration>> getCollaborationsByProjectId(@PathVariable UUID projectId) {
        List<Collaboration> collaborations = collaborationService.getCollaborationsByProjectId(projectId);
        return ResponseEntity.ok(collaborations);
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Collaboration>> getCollaborationsByCompanyId(@PathVariable UUID companyId) {
        List<Collaboration> collaborations = collaborationService.getCollaborationsByCompanyId(companyId);
        return ResponseEntity.ok(collaborations);
    }

    @GetMapping("/contact/{contactId}")
    public ResponseEntity<List<Collaboration>> getCollaborationsByContactId(@PathVariable UUID contactId) {
        List<Collaboration> collaborations = collaborationService.getCollaborationsByContactId(contactId);
        return ResponseEntity.ok(collaborations);
    }

    @GetMapping("/responsible/{responsibleId}")
    public ResponseEntity<List<Collaboration>> getCollaborationsByResponsibleId(@PathVariable UUID responsibleId) {
        List<Collaboration> collaborations = collaborationService.getCollaborationsByResponsibleId(responsibleId);
        return ResponseEntity.ok(collaborations);
    }

    @PostMapping("")
    public ResponseEntity<?> createCollaboration(@Valid @RequestBody Collaboration collaboration) {
        try {
            Collaboration createdCollaboration = collaborationService.createCollaboration(collaboration);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCollaboration);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCollaboration(@PathVariable UUID id, @Valid @RequestBody Collaboration collaboration) {
        try {
            Collaboration updatedCollaboration = collaborationService.updateCollaboration(id, collaboration);
            return ResponseEntity.ok(updatedCollaboration);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCollaboration(@PathVariable UUID id) {
        try {
            collaborationService.deleteCollaboration(id);
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}