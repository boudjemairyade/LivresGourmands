-- Ajout de la table des favoris
USE livresgourmands;

CREATE TABLE IF NOT EXISTS favoris (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    ouvrage_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE,
    UNIQUE KEY unique_client_ouvrage (client_id, ouvrage_id),
    INDEX idx_client (client_id),
    INDEX idx_ouvrage (ouvrage_id)
);


