package kolab.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

@Entity
@Table(name = "collaboration")
public class Collaboration {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "projectId", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "companyId", nullable = false)
    private Company company;

    @ManyToOne
    @JoinColumn(name = "contactId")
    private CompanyContact contact;

    @ManyToOne
    @JoinColumn(name = "responsibleId")
    private User responsible;

    @NotBlank(message = "Category is required")
    @Column(nullable = false)
    private String category;

    @NotBlank(message = "Status is required")
    @Column(nullable = false)
    private String status;

    @Column
    private String comment;

    @Column(name = "achievedValue")
    private Long achievedValue;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public CompanyContact getContact() { return contact; }
    public void setContact(CompanyContact contact) { this.contact = contact; }

    public User getResponsible() { return responsible; }
    public void setResponsible(User responsible) { this.responsible = responsible; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Long getAchievedValue() { return achievedValue; }
    public void setAchievedValue(Long achievedValue) { this.achievedValue = achievedValue; }
}