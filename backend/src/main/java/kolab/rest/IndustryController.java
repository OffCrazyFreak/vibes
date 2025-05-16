package kolab.rest;
import kolab.domain.Industry;
import kolab.service.IndustryService;
import kolab.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/industries")
public class IndustryController {

    @Autowired
    private IndustryService industryService;

    @GetMapping
    public ResponseEntity<List<Industry>> getAllIndustries() {
        return ResponseEntity.ok(industryService.getAllIndustries());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Industry> getIndustryById(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(industryService.getIndustryById(id));
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createIndustry(@Valid @RequestBody Industry industry) {
        try {
            Industry createdIndustry = industryService.createIndustry(industry);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdIndustry);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateIndustry(@PathVariable UUID id, @Valid @RequestBody Industry industry) {
        try {
            Industry updatedIndustry = industryService.updateIndustry(id, industry);
            return ResponseEntity.ok(updatedIndustry);
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIndustry(@PathVariable UUID id) {
        try {
            industryService.deleteIndustry(id);
            return ResponseEntity.ok().build();
        } catch (NotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}