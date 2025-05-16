package kolab.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

@Entity
@Table(name = "company")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "industryId", nullable = false)
    private Industry industry;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    private String categorization;

    @Column(name = "budgetPlanningMonth")
    private String budgetPlanningMonth;

    @NotBlank(message = "Country is required")
    @Column(nullable = false)
    private String country;

    @NotNull(message = "ZIP code is required")
    @Column(nullable = false)
    private Long zip;

    @NotBlank(message = "City is required")
    @Column(nullable = false)
    private String city;

    private String address;

    @Column(name = "webLink")
    private String webLink;

    private String description;

    @Column(name = "contactInFuture", nullable = false)
    private boolean contactInFuture;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Industry getIndustry() { return industry; }
    public void setIndustry(Industry industry) { this.industry = industry; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategorization() { return categorization; }
    public void setCategorization(String categorization) { this.categorization = categorization; }

    public String getBudgetPlanningMonth() { return budgetPlanningMonth; }
    public void setBudgetPlanningMonth(String budgetPlanningMonth) { this.budgetPlanningMonth = budgetPlanningMonth; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public Long getZip() { return zip; }
    public void setZip(Long zip) { this.zip = zip; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getWebLink() { return webLink; }
    public void setWebLink(String webLink) { this.webLink = webLink; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isContactInFuture() { return contactInFuture; }
    public void setContactInFuture(boolean contactInFuture) { this.contactInFuture = contactInFuture; }
}