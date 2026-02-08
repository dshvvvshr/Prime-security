# OpenSSL Development Guide

This guide provides instructions for developers who want to work with OpenSSL source code for advanced cryptographic implementations, security research, or deeper understanding of cryptographic primitives.

## Overview

While Prime Security uses Node.js's built-in `crypto` module (which is backed by OpenSSL), some developers may want to:
- Study OpenSSL's implementation details
- Build custom cryptographic tools
- Contribute to OpenSSL development
- Understand low-level security implementations
- Test against specific OpenSSL versions

## Cloning OpenSSL Repository

To get the OpenSSL source code:

```bash
git clone git://git.openssl.org/openssl.git
cd openssl
```

Alternative HTTPS URL (if git:// protocol is blocked):
```bash
git clone https://github.com/openssl/openssl.git
cd openssl
```

## Building OpenSSL from Source

### Prerequisites

**Linux/Unix:**
```bash
# Debian/Ubuntu
sudo apt-get update
sudo apt-get install build-essential perl

# RHEL/CentOS/Fedora
sudo yum groupinstall "Development Tools"
sudo yum install perl-core
```

**macOS:**
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Perl is usually pre-installed
```

**Windows:**
- Install Visual Studio with C++ development tools
- Install Perl (Strawberry Perl or ActivePerl)
- Install NASM assembler (optional, for optimized builds)

### Building on Linux/Unix/macOS

```bash
# Configure for your platform
./Configure

# For a specific platform (e.g., Linux x86_64)
./Configure linux-x86_64

# Build
make

# Run tests (optional but recommended)
make test

# Install (optional)
sudo make install
```

### Building on Windows

```cmd
# Open Visual Studio Developer Command Prompt

# Configure
perl Configure VC-WIN64A

# Build
nmake

# Test
nmake test

# Install (optional)
nmake install
```

## Working with Different OpenSSL Versions

```bash
# List available tags/versions
git tag -l

# Checkout a specific version
git checkout OpenSSL_1_1_1w

# Checkout the latest stable 3.x version
git checkout openssl-3.2

# Return to master branch
git checkout master
```

## Integration with Prime Security

Prime Security uses Node.js's `crypto` module, which typically links against the system's OpenSSL installation. To verify which OpenSSL version Node.js is using:

```bash
node -p "process.versions.openssl"
```

### Using Custom OpenSSL Build with Node.js

If you need Node.js to use a custom OpenSSL build:

```bash
# Build Node.js with custom OpenSSL
git clone https://github.com/nodejs/node.git
cd node
./configure --shared-openssl --shared-openssl-includes=/path/to/openssl/include \
            --shared-openssl-libpath=/path/to/openssl/lib
make
```

## OpenSSL Command-Line Tools

After building OpenSSL, you can use its command-line tools for testing and development:

### Generating Keys

```bash
# Generate RSA private key
./apps/openssl genrsa -out private.pem 2048

# Extract public key
./apps/openssl rsa -in private.pem -pubout -out public.pem

# Generate elliptic curve key
./apps/openssl ecparam -name prime256v1 -genkey -out ec-private.pem
```

### Encryption/Decryption

```bash
# Encrypt a file with AES-256-CBC
./apps/openssl enc -aes-256-cbc -salt -in plaintext.txt -out encrypted.bin

# Decrypt
./apps/openssl enc -d -aes-256-cbc -in encrypted.bin -out decrypted.txt
```

### Hashing

```bash
# SHA-256 hash
echo -n "test data" | ./apps/openssl dgst -sha256

# File hash
./apps/openssl dgst -sha256 file.txt
```

### Testing TLS/SSL Connections

```bash
# Test TLS connection
./apps/openssl s_client -connect example.com:443 -showcerts

# Test with specific TLS version
./apps/openssl s_client -connect example.com:443 -tls1_3
```

## Security Considerations

When working with OpenSSL source code:

1. **Use Official Sources**: Always clone from official repositories
   - `git://git.openssl.org/openssl.git`
   - `https://github.com/openssl/openssl.git`

2. **Verify Signatures**: For release tarballs, verify GPG signatures
   ```bash
   gpg --verify openssl-3.2.0.tar.gz.asc openssl-3.2.0.tar.gz
   ```

3. **Stay Updated**: Subscribe to OpenSSL security advisories
   - https://www.openssl.org/news/secadv/

4. **Test Thoroughly**: Always run `make test` before using a custom build

5. **Follow Best Practices**: 
   - Don't modify core cryptographic algorithms unless you're an expert
   - Document all changes
   - Run security audits on modifications
   - Follow the Core Directive principles

## Resources

### Official Documentation
- OpenSSL Website: https://www.openssl.org/
- GitHub Repository: https://github.com/openssl/openssl
- Documentation: https://www.openssl.org/docs/
- Wiki: https://wiki.openssl.org/

### Security
- Security Policy: https://www.openssl.org/policies/secpolicy.html
- Security Advisories: https://www.openssl.org/news/secadv/
- Vulnerability Reports: https://www.openssl.org/news/vulnerabilities.html

### Community
- Mailing Lists: https://www.openssl.org/community/mailinglists.html
- GitHub Issues: https://github.com/openssl/openssl/issues
- Stack Overflow: Tag `openssl`

## Contributing to OpenSSL

If you plan to contribute to OpenSSL:

1. Read the Contributing Guide: https://github.com/openssl/openssl/blob/master/CONTRIBUTING.md
2. Follow the Coding Style: https://www.openssl.org/policies/codingstyle.html
3. Sign the CLA (Contributor License Agreement)
4. Submit pull requests on GitHub

## Integration Examples

### Verifying Prime Security's Crypto Implementation

You can use OpenSSL to verify that Prime Security's crypto module produces correct results:

```bash
# Generate test data
echo -n "test data" > testfile.txt

# Hash with OpenSSL
openssl dgst -sha256 testfile.txt

# Compare with Prime Security output
node -e "const {hash} = require('./dist/security/crypto'); console.log(hash('test data'));"
```

### Testing Encryption Compatibility

```bash
# Encrypt with OpenSSL (AES-256-GCM)
# Note: This requires manual IV and key handling for exact comparison
```

## Troubleshooting

### Common Build Issues

1. **Missing Dependencies**
   ```bash
   # Install missing Perl modules
   cpan install Text::Template
   ```

2. **Configuration Errors**
   ```bash
   # Clean and reconfigure
   make clean
   ./Configure
   ```

3. **Test Failures**
   ```bash
   # Run specific test
   make test TESTS="test_name"
   
   # Verbose test output
   make test V=1
   ```

### Platform-Specific Issues

**macOS M1/M2 (Apple Silicon)**:
```bash
./Configure darwin64-arm64-cc
```

**Cross-compilation**:
```bash
./Configure linux-aarch64 --cross-compile-prefix=aarch64-linux-gnu-
```

## Alignment with Prime Security Core Directive

When working with OpenSSL in the context of Prime Security:

1. ✅ **Security First**: Use OpenSSL to enhance security, never compromise it
2. ✅ **Transparency**: Document all cryptographic choices and implementations
3. ✅ **Auditability**: Log all security-relevant operations
4. ✅ **Best Practices**: Follow OpenSSL and Prime Security guidelines
5. ✅ **No Backdoors**: Never weaken cryptography or add hidden functionality
6. ✅ **Privacy**: Respect user privacy in all implementations

---

*This guide is part of the Prime Security project and follows the principles outlined in the [Core Directive](../CORE_DIRECTIVE.md).*
