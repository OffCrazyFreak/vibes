package kolab.service;
import kolab.domain.Industry;
import java.util.List;
import java.util.UUID;

public interface IndustryService {
    List<Industry> getAllIndustries();
    Industry getIndustryById(UUID id);
    Industry createIndustry(Industry industry);
    Industry updateIndustry(UUID id, Industry industry);
    void deleteIndustry(UUID id);
}