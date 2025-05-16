package kolab.rest;

import kolab.domain.Company;
import kolab.service.CompanyService;
import kolab.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @GetMapping("")
    public ResponseEntity<List<Company>> getCompanies() {
        List<Company> companies = companyService.getCompanies();
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCompanyById(@PathVariable UUID id) {
        try {
            Company company = companyService.getCompanyById(id);
            return ResponseEntity.ok(company);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/industry/{industryId}")
    public ResponseEntity<List<Company>> getCompaniesByIndustryId(@PathVariable UUID industryId) {
        List<Company> companies = companyService.getCompaniesByIndustryId(industryId);
        return ResponseEntity.ok(companies);
    }

    @PostMapping("")
    public ResponseEntity<?> createCompany(@Valid @RequestBody Company company) {
        try {
            Company createdCompany = companyService.createCompany(company);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCompany);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompany(@PathVariable UUID id, @Valid @RequestBody Company company) {
        try {
            Company updatedCompany = companyService.updateCompany(id, company);
            return ResponseEntity.ok(updatedCompany);
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable UUID id) {
        try {
            companyService.deleteCompany(id);
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}