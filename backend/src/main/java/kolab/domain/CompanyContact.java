package kolab.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

import java.util.UUID;

@Entity
@Table(name = "company_contact")
public class CompanyContact {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "companyId", nullable = false)
    private Company company;

    @NotBlank(message = "First name is required")
    @Column(nullable = false)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Column(nullable = false)
    private String lastName;

    @NotBlank(message = "Position is required")
    @Column(nullable = false)
    private String position;

    @Email(message = "Email should be valid")
    @Column(nullable = false)
    private String email;

    private String phone;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}