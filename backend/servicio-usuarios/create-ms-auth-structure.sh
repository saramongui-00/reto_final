#!/bin/bash
# Script Bash para crear la estructura de ms-auth
# Uso: chmod +x create-ms-auth-structure.sh && ./create-ms-auth-structure.sh

# Rutas base
BASE_PATH="src/main/java/com/optica/ms/auth"
RESOURCES_PATH="src/main/resources"

echo "Creando estructura de directorios..."

# Crear directorios base usando mkdir -p (crea directorios padres si no existen)
mkdir -p "$BASE_PATH/shared/domain"
mkdir -p "$BASE_PATH/shared/application"
mkdir -p "$BASE_PATH/shared/infrastructure"
mkdir -p "$BASE_PATH/domain/model"
mkdir -p "$BASE_PATH/domain/repository"
mkdir -p "$BASE_PATH/domain/service"
mkdir -p "$BASE_PATH/domain/exception"
mkdir -p "$BASE_PATH/domain/events"
mkdir -p "$BASE_PATH/application/ports"
mkdir -p "$BASE_PATH/application/usecase"
mkdir -p "$BASE_PATH/application/dto"
mkdir -p "$BASE_PATH/application/mapper"
mkdir -p "$BASE_PATH/infrastructure/entrypoints"
mkdir -p "$BASE_PATH/infrastructure/adapters"
mkdir -p "$BASE_PATH/infrastructure/messaging"
mkdir -p "$BASE_PATH/infrastructure/config"
mkdir -p "$BASE_PATH/infrastructure/mapper"
mkdir -p "$RESOURCES_PATH"

echo "Creando archivos..."

# Crear archivos vacíos usando touch
# Shared domain files
touch "$BASE_PATH/shared/domain/Entity.java"
touch "$BASE_PATH/shared/domain/AggregateRoot.java"
touch "$BASE_PATH/shared/domain/ValueObject.java"
touch "$BASE_PATH/shared/domain/DomainEvent.java"
touch "$BASE_PATH/shared/domain/EventPublisher.java"

# Shared application files
touch "$BASE_PATH/shared/application/UseCase.java"
touch "$BASE_PATH/shared/application/PaginationResponse.java"

# Shared infrastructure files
touch "$BASE_PATH/shared/infrastructure/GlobalExceptionHandler.java"

# Domain model files
touch "$BASE_PATH/domain/model/UserAuth.java"
touch "$BASE_PATH/domain/model/UserId.java"
touch "$BASE_PATH/domain/model/Email.java"
touch "$BASE_PATH/domain/model/Password.java"
touch "$BASE_PATH/domain/model/Role.java"

# Domain repository files
touch "$BASE_PATH/domain/repository/UserAuthRepository.java"

# Domain service files
touch "$BASE_PATH/domain/service/UserDomainService.java"

# Domain exception files
touch "$BASE_PATH/domain/exception/InvalidCredentialsException.java"
touch "$BASE_PATH/domain/exception/EmailAlreadyExistsException.java"

# Domain events files
touch "$BASE_PATH/domain/events/UserRegisteredEvent.java"

# Application ports files
touch "$BASE_PATH/application/ports/RegisterUseCase.java"
touch "$BASE_PATH/application/ports/LoginUseCase.java"

# Application usecase files
touch "$BASE_PATH/application/usecase/RegisterUseCaseImpl.java"
touch "$BASE_PATH/application/usecase/LoginUseCaseImpl.java"

# Application dto files
touch "$BASE_PATH/application/dto/RegisterRequestDto.java"
touch "$BASE_PATH/application/dto/LoginRequestDto.java"
touch "$BASE_PATH/application/dto/AuthResponseDto.java"

# Application mapper files
touch "$BASE_PATH/application/mapper/AuthDtoMapper.java"

# Infrastructure entrypoints files
touch "$BASE_PATH/infrastructure/entrypoints/AuthHttpController.java"

# Infrastructure adapters files
touch "$BASE_PATH/infrastructure/adapters/SpringDataUserRepository.java"
touch "$BASE_PATH/infrastructure/adapters/JpaUserAuthRepositoryAdapter.java"
touch "$BASE_PATH/infrastructure/adapters/BcryptPasswordEncoderAdapter.java"

# Infrastructure messaging files
touch "$BASE_PATH/infrastructure/messaging/KafkaEventPublisherAdapter.java"

# Infrastructure config files
touch "$BASE_PATH/infrastructure/config/SpringSecurityConfig.java"
touch "$BASE_PATH/infrastructure/config/ApplicationServiceBeanConfig.java"

# Infrastructure mapper files
touch "$BASE_PATH/infrastructure/mapper/UserEntityMapper.java"
touch "$BASE_PATH/infrastructure/mapper/UserEntity.java"

# Root application file
touch "$BASE_PATH/MsAuthApplication.java"

# Resources files
touch "$RESOURCES_PATH/application.yml"

echo "✓ Estructura de ms-auth creada exitosamente en: $BASE_PATH"
echo "✓ Archivos de recurso creados en: $RESOURCES_PATH"
