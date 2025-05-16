package kolab.dao;

import kolab.domain.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID> {
    List<Company> findByIndustryId(UUID industryId);
    Company findByName(String name);
    boolean existsByName(String name);
}