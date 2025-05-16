package kolab.service.impl;

import kolab.dao.CompanyRepository;
import kolab.domain.Company;
import kolab.service.CompanyService;
import kolab.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import java.util.List;
import java.util.UUID;

@Service
public class CompanyServiceJpa implements CompanyService {
    @Autowired
    private CompanyRepository companyRepo;

    @Override
    public List<Company> getCompanies() {
        return companyRepo.findAll();
    }

    @Override
    public Company getCompanyById(UUID id) {
        return companyRepo.findById(id)
            .orElseThrow(() -> new NotFoundException("Company with id " + id + " not found"));
    }

    @Override
    public List<Company> getCompaniesByIndustryId(UUID industryId) {
        return companyRepo.findByIndustryId(industryId);
    }

    @Override
    public Company createCompany(Company company) {
        Assert.notNull(company, "Company object must be given");
        if (companyRepo.existsByName(company.getName())) {
            throw new IllegalArgumentException("Company with name " + company.getName() + " already exists");
        }
        validateCompany(company);
        return companyRepo.save(company);
    }

    @Override
    public Company updateCompany(UUID id, Company updatedCompany) {
        Company company = getCompanyById(id);
        validateCompany(updatedCompany);

        if (!company.getName().equals(updatedCompany.getName()) && 
            companyRepo.existsByName(updatedCompany.getName())) {
            throw new IllegalArgumentException("Company with name " + updatedCompany.getName() + " already exists");
        }

        company.setIndustry(updatedCompany.getIndustry());
        company.setName(updatedCompany.getName());
        company.setCategorization(updatedCompany.getCategorization());
        company.setBudgetPlanningMonth(updatedCompany.getBudgetPlanningMonth());
        company.setCountry(updatedCompany.getCountry());
        company.setZip(updatedCompany.getZip());
        company.setCity(updatedCompany.getCity());
        company.setAddress(updatedCompany.getAddress());
        company.setWebLink(updatedCompany.getWebLink());
        company.setDescription(updatedCompany.getDescription());
        company.setContactInFuture(updatedCompany.isContactInFuture());

        return companyRepo.save(company);
    }

    @Override
    public void deleteCompany(UUID id) {
        if (companyRepo.existsById(id)) {
            companyRepo.deleteById(id);
        } else {
            throw new NotFoundException("Company with id " + id + " not found");
        }
    }

    private void validateCompany(Company company) {
        if (company.getName() == null || company.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (company.getCountry() == null || company.getCountry().trim().isEmpty()) {
            throw new IllegalArgumentException("Country is required");
        }
        if (company.getCity() == null || company.getCity().trim().isEmpty()) {
            throw new IllegalArgumentException("City is required");
        }
        if (company.getZip() == null) {
            throw new IllegalArgumentException("ZIP code is required");
        }
        if (company.getIndustry() == null) {
            throw new IllegalArgumentException("Industry is required");
        }
    }
}