package kolab.service;

import kolab.domain.Company;
import java.util.List;
import java.util.UUID;

public interface CompanyService {
    List<Company> getCompanies();
    Company getCompanyById(UUID id);
    List<Company> getCompaniesByIndustryId(UUID industryId);
    Company createCompany(Company company);
    Company updateCompany(UUID id, Company company);
    void deleteCompany(UUID id);
}