package kolab.domain;

import jakarta.persistence.*;
import javax.validation.constraints.*;
import java.util.UUID;

@Entity
@Table(name = "industry")
public class Industry {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Industry name is required")
    @Size(min = 2, max = 100, message = "Industry name must be between 2 and 100 characters")
    @Column(nullable = false, unique = true)
    private String name;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}