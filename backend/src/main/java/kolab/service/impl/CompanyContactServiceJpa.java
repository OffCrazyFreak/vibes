package kolab.service.impl;

import kolab.dao.CompanyContactRepository;
import kolab.domain.CompanyContact;
import kolab.service.CompanyContactService;
import kolab.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import java.util.List;
import java.util.UUID;

@Service
public class CompanyContactServiceJpa implements CompanyContactService {
    @Autowired
    private CompanyContactRepository contactRepo;

    @Override
    public List<CompanyContact> getCompanyContacts() {
        return contactRepo.findAll();
    }

    @Override
    public CompanyContact getCompanyContactById(UUID id) {
        return contactRepo.findById(id)
            .orElseThrow(() -> new NotFoundException("Company contact with id " + id + " not found"));
    }

    @Override
    public List<CompanyContact> getContactsByCompanyId(UUID companyId) {
        return contactRepo.findByCompanyId(companyId);
    }

    @Override
    public CompanyContact createCompanyContact(CompanyContact contact) {
        Assert.notNull(contact, "Contact object must be given");
        if (contactRepo.existsByEmail(contact.getEmail())) {
            throw new IllegalArgumentException("Contact with email " + contact.getEmail() + " already exists");
        }
        validateContact(contact);
        return contactRepo.save(contact);
    }

    @Override
    public CompanyContact updateCompanyContact(UUID id, CompanyContact updatedContact) {
        CompanyContact contact = getCompanyContactById(id);
        validateContact(updatedContact);

        if (!contact.getEmail().equals(updatedContact.getEmail()) && 
            contactRepo.existsByEmail(updatedContact.getEmail())) {
            throw new IllegalArgumentException("Contact with email " + updatedContact.getEmail() + " already exists");
        }

        contact.setCompany(updatedContact.getCompany());
        contact.setFirstName(updatedContact.getFirstName());
        contact.setLastName(updatedContact.getLastName());
        contact.setPosition(updatedContact.getPosition());
        contact.setEmail(updatedContact.getEmail());
        contact.setPhone(updatedContact.getPhone());

        return contactRepo.save(contact);
    }

    @Override
    public void deleteCompanyContact(UUID id) {
        if (contactRepo.existsById(id)) {
            contactRepo.deleteById(id);
        } else {
            throw new NotFoundException("Company contact with id " + id + " not found");
        }
    }

    private void validateContact(CompanyContact contact) {
        if (contact.getFirstName() == null || contact.getFirstName().trim().isEmpty()) {
            throw new IllegalArgumentException("First name is required");
        }
        if (contact.getLastName() == null || contact.getLastName().trim().isEmpty()) {
            throw new IllegalArgumentException("Last name is required");
        }
        if (contact.getPosition() == null || contact.getPosition().trim().isEmpty()) {
            throw new IllegalArgumentException("Position is required");
        }
        if (contact.getEmail() == null || contact.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (contact.getCompany() == null) {
            throw new IllegalArgumentException("Company is required");
        }
    }
}