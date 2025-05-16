package kolab.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import kolab.domain.Industry;
import java.util.UUID;

public interface IndustryRepository extends JpaRepository<Industry, UUID> {
    boolean existsByName(String name);
}