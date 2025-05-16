package kolab.rest;

import kolab.domain.CompanyContact;
import kolab.service.CompanyContactService;
import kolab.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/company-contacts")
public class CompanyContactController {

    @Autowired
    private CompanyContactService contactService;

    @GetMapping("")
    public ResponseEntity<List<CompanyContact>> getCompanyContacts() {
        List<CompanyContact> contacts = contactService.getCompanyContacts();
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCompanyContactById(@PathVariable UUID id) {
        try {
            CompanyContact contact = contactService.getCompanyContactById(id);
            return ResponseEntity.ok(contact);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<CompanyContact>> getContactsByCompanyId(@PathVariable UUID companyId) {
        List<CompanyContact> contacts = contactService.getContactsByCompanyId(companyId);
        return ResponseEntity.ok(contacts);
    }

    @PostMapping("")
    public ResponseEntity<?> createCompanyContact(@Valid @RequestBody CompanyContact contact) {
        try {
            CompanyContact createdContact = contactService.createCompanyContact(contact);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdContact);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompanyContact(@PathVariable UUID id, @Valid @RequestBody CompanyContact contact) {
        try {
            CompanyContact updatedContact = contactService.updateCompanyContact(id, contact);
            return ResponseEntity.ok(updatedContact);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompanyContact(@PathVariable UUID id) {
        try {
            contactService.deleteCompanyContact(id);
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}