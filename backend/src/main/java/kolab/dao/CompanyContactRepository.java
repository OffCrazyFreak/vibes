package kolab.dao;

import kolab.domain.CompanyContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface CompanyContactRepository extends JpaRepository<CompanyContact, UUID> {
    List<CompanyContact> findByCompanyId(UUID companyId);
    boolean existsByEmail(String email);
}