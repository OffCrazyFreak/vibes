package kolab.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "project")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "categoryId", nullable = false)
    private Category category;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Type is required")
    @Column(nullable = false)
    private String type;

    @NotNull(message = "Start date is required")
    @Column(name = "startDate", nullable = false)
    private ZonedDateTime startDate;

    @Column(name = "endDate")
    private ZonedDateTime endDate;

    @Column
    private Long goal;

    @ManyToOne
    @JoinColumn(name = "responsibleId", nullable = false)
    private User responsible;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public ZonedDateTime getStartDate() { return startDate; }
    public void setStartDate(ZonedDateTime startDate) { this.startDate = startDate; }

    public ZonedDateTime getEndDate() { return endDate; }
    public void setEndDate(ZonedDateTime endDate) { this.endDate = endDate; }

    public Long getGoal() { return goal; }
    public void setGoal(Long goal) { this.goal = goal; }

    public User getResponsible() { return responsible; }
    public void setResponsible(User responsible) { this.responsible = responsible; }
}