package es2.logs.bridge;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class FileDestination implements LogDestination {
    private final Path filePath;

    public FileDestination() {
        this.filePath = buildFilePath("logs");
    }

    public FileDestination(String folderName) {
        this.filePath = buildFilePath(folderName);
    }

    private Path buildFilePath(String folderName) {
        String finalFolder = (folderName == null || folderName.isBlank()) ? "logs" : folderName.trim().toLowerCase();
        String finalFileName = generateDefaultFileName();

        if (!finalFileName.endsWith(".log")) {
            finalFileName += ".log";
        }

        Path folder = Paths.get(finalFolder);

        try {
            Files.createDirectories(folder);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível criar a pasta de logs: " + finalFolder, e);
        }

        return folder.resolve(finalFileName);
    }

    private String generateDefaultFileName() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("ddMMyyyy_HHmmss");
        return "log_" + LocalDateTime.now().format(formatter);
    }

    @Override
    public void send(String formattedMessage) {
        try (BufferedWriter writer = Files.newBufferedWriter(
                filePath,
                StandardOpenOption.CREATE,
                StandardOpenOption.APPEND
        )) {
            writer.write(formattedMessage);
            writer.newLine();
        } catch (IOException e) {
            System.err.println("Erro ao escrever no ficheiro de logs: " + e.getMessage());
        }
    }

    public String getFilePath() {
        return filePath.toString();
    }
}