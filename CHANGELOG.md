# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Circular dependency detection in ModuleRegistry
- Dependency initialization enforcement before module init
- Support for stopping modules in transitional states (STARTING, INITIALIZING, ERROR)
- Error handling in example shutdown code
- Documentation for console usage rationale in ESLint config
- ESLint override for examples directory
- package-lock.json for reproducible builds

### Changed
- Core Directive lookup now uses __dirname instead of process.cwd() for better reliability
- SQL injection pattern refined to reduce false positives (removed * and ' checks)
- PBKDF2 iterations increased from 100,000 to 600,000 (OWASP recommended)
- Email validation regex improved to require 2+ character TLD
- Audit event rotation optimized using shift() instead of slice()
- Audit event query optimized to avoid intermediate arrays when limit specified

### Fixed
- CI/CD npm cache issue by adding package-lock.json
- package-lock.json removed from .gitignore

## [0.1.0] - 2025-12-17

### Added
- Initial release with core security framework
- Module registry with dependency management
- Autonomic DNA system for self-organization
- Governance and compliance checking
- Cryptographic primitives (AES-256-GCM, SHA-256/512, PBKDF2)
- Input validation (SQL injection and XSS detection)
- Audit logging system
- Core Directive compliance framework
- GitHub Actions CI/CD pipeline
