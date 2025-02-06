# Mail Server

This project sets up a mail server using Docker, Postfix, and Supervisor. It includes an API component, configuration files, and scripts to facilitate deployment and management.

## Project Structure

- `.github/workflows/`: Contains GitHub Actions workflows for CI/CD.
- `api/`: Contains the API implementation.
- `postfix/`: Contains Postfix configuration files.
- `supervisor/`: Contains Supervisor configuration files.
- `.dockerignore`: Specifies files and directories to ignore in the Docker build context.
- `.env.example`: Example environment variables file.
- `.gitignore`: Specifies files and directories to ignore in Git.
- `Dockerfile`: Defines the Docker image build process.
- `fly.toml`: Configuration file for deploying with Fly.io.
- `start.sh`: Shell script to initialize and start the services.

## Technologies Used

- **JavaScript**: Primary language for the API implementation.
- **Docker**: Containerization platform used to package the application.
- **Postfix**: Mail transfer agent used for routing and delivering email.
- **Supervisor**: Process control system used to manage processes.
