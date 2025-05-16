package kolab.service.impl;

import kolab.dao.IndustryRepository;
import kolab.domain.Industry;
import kolab.service.IndustryService;
import kolab.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class IndustryServiceJpa implements IndustryService {

    @Autowired
    private IndustryRepository industryRepository;

    @Override
    public List<Industry> getAllIndustries() {
        return industryRepository.findAll();
    }

    @Override
    public Industry getIndustryById(UUID id) {
        return industryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Industry not found with id: " + id));
    }

    @Override
    public Industry createIndustry(Industry industry) {
        if (industryRepository.existsByName(industry.getName())) {
            throw new IllegalArgumentException("Industry with name " + industry.getName() + " already exists");
        }
        return industryRepository.save(industry);
    }

    @Override
    public Industry updateIndustry(UUID id, Industry industry) {
        Industry existingIndustry = getIndustryById(id);
        
        if (!existingIndustry.getName().equals(industry.getName()) && 
            industryRepository.existsByName(industry.getName())) {
            throw new IllegalArgumentException("Industry with name " + industry.getName() + " already exists");
        }
        
        existingIndustry.setName(industry.getName());
        return industryRepository.save(existingIndustry);
    }

    @Override
    public void deleteIndustry(UUID id) {
        if (!industryRepository.existsById(id)) {
            throw new NotFoundException("Industry not found with id: " + id);
        }
        industryRepository.deleteById(id);
    }
}