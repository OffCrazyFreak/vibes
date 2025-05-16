package kolab.service;

import kolab.domain.CompanyContact;
import java.util.List;
import java.util.UUID;

public interface CompanyContactService {
    List<CompanyContact> getCompanyContacts();
    CompanyContact getCompanyContactById(UUID id);
    List<CompanyContact> getContactsByCompanyId(UUID companyId);
    CompanyContact createCompanyContact(CompanyContact contact);
    CompanyContact updateCompanyContact(UUID id, CompanyContact contact);
    void deleteCompanyContact(UUID id);
}