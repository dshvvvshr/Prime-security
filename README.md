# Prime Security

A self-organizing, multi-agent security framework with Bluetooth device scanning and cloning capabilities. This framework provides the foundation for security testing and analysis with a focus on autonomic governance and compliance.

## Features

- **Bluetooth Security**:
  - Scan for Bluetooth and BLE devices
  - Identify device information (name, address, services, RSSI)
  - Clone device profiles for security testing and emulation
  - Export/import device clones for analysis
  
- **Core Security Primitives**:
  - Cryptographic operations (hashing, encryption, HMAC)
  - Input validation and sanitization
  - Secure random generation

- **Governance & Compliance**:
  - Audit logging for all security operations
  - Compliance checking framework
  - Module dependency management

- **Autonomic System**:
  - Self-organizing module registry
  - Digital DNA blueprint system
  - Dynamic module initialization

## Prerequisites

- Node.js 18 or higher
- Bluetooth hardware (for Bluetooth scanning features)
- Linux-based system recommended for Bluetooth support

## Installation

1. Clone the repository:
```bash
git clone https://github.com/dshvvvshr/Prime-security.git
cd Prime-security
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Usage

### Bluetooth Scanning and Cloning

#### Basic Scanning

```typescript
import { bluetooth } from 'prime-security';

// Access the bluetooth scanner instance
const scanner = bluetooth.bluetoothScanner.instance;

// Check if Bluetooth is ready
const isReady = await scanner.isReady();

if (isReady) {
  // Scan for devices (5 seconds by default)
  const result = await scanner.scan({ duration: 5000 });
  
  console.log(`Found ${result.devices.length} devices:`);
  result.devices.forEach(device => {
    console.log(`  - ${device.name || 'Unknown'} (${device.address})`);
    console.log(`    RSSI: ${device.rssi} dBm`);
    console.log(`    Services: ${device.advertisement.serviceUuids?.join(', ') || 'None'}`);
  });
}
```

#### Device Identification

```typescript
// Get detailed information about a specific device
const device = await scanner.identifyDevice('device-id-here');

if (device) {
  console.log('Device Details:');
  console.log(`  ID: ${device.id}`);
  console.log(`  Address: ${device.address}`);
  console.log(`  Name: ${device.name}`);
  console.log(`  RSSI: ${device.rssi} dBm`);
  console.log(`  Connectable: ${device.connectable}`);
  console.log(`  Services: ${device.advertisement.serviceUuids?.join(', ')}`);
}
```

#### Device Cloning

```typescript
// Clone a device for security testing
const clone = await scanner.cloneDevice('device-id-here');

if (clone) {
  console.log('Device Clone Created:');
  console.log(`  Device ID: ${clone.deviceId}`);
  console.log(`  Name: ${clone.name}`);
  console.log(`  Address: ${clone.address}`);
  
  // Export clone to JSON for later use
  const cloneJson = scanner.exportClone('device-id-here');
  if (cloneJson) {
    // Save to file or database
    require('fs').writeFileSync('device-clone.json', cloneJson);
  }
}

// Import a previously saved clone
const savedClone = require('fs').readFileSync('device-clone.json', 'utf8');
const importedClone = scanner.importClone(savedClone);
```

#### Scanner Status and Management

```typescript
// Get scanner status
const status = scanner.getStatus();
console.log('Scanner Status:', status);
// Output:
// {
//   scanning: false,
//   bluetoothState: 'poweredOn',
//   discoveredCount: 5,
//   clonedCount: 2
// }

// Get all discovered devices
const discovered = scanner.getDiscoveredDevices();

// Get all cloned devices
const cloned = scanner.getClonedDevices();

// Clear caches
scanner.clearDiscovered();
scanner.clearClones();
```

### Core Security Operations

```typescript
import { crypto } from 'prime-security';

// Hash data
const hashed = crypto.hash('sensitive data');

// Encrypt data
const key = Buffer.from('...32-byte-key...');
const { encrypted, iv, authTag } = crypto.encrypt('secret message', key);

// Decrypt data
const decrypted = crypto.decrypt(encrypted, key, iv, authTag);

// Validate input
const isSafe = crypto.Validator.isSafeString('user input');
const hasXSS = crypto.Validator.hasXSS('<script>alert(1)</script>');
```

### System Initialization

```typescript
import { PrimeSecurity } from 'prime-security';

const system = new PrimeSecurity();

// Initialize with default blueprint
await system.initialize();

// Start the system
await system.start();

// Get status
const status = system.getStatus();
console.log(`Modules: ${status.modules.length}`);
console.log(`Audit Events: ${status.auditEventCount}`);

// Stop gracefully
await system.stop();
```

## Development

### Project Structure

```
Prime-security/
├── src/
│   ├── index.ts                # Main system entry point
│   ├── autonomic/
│   │   └── dna.ts             # System blueprint management
│   ├── governance/
│   │   └── compliance.ts      # Audit logging and compliance
│   ├── registry/
│   │   └── index.ts           # Module registry
│   └── security/
│       ├── crypto.ts          # Cryptographic primitives
│       └── bluetooth.ts       # Bluetooth scanning & cloning
├── tests/
│   ├── registry/
│   └── security/
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
npm run build
```

### Running Tests

```bash
npm test

# Run specific test suite
npm test -- tests/security/bluetooth.test.ts

# Run with coverage
npm run test:coverage
```

### Linting and Formatting

```bash
npm run lint
npm run lint:fix
npm run format
```

## Bluetooth Device Cloning

The Bluetooth cloning feature allows you to:

1. **Scan** for nearby Bluetooth and BLE devices
2. **Identify** devices by their address, name, services, and characteristics
3. **Clone** device profiles including:
   - Device address and name
   - Advertisement data (manufacturer data, service UUIDs, tx power)
   - Service and characteristic information
   - Metadata (RSSI, connectable status, timestamp)

4. **Export/Import** clones as JSON for:
   - Security testing and penetration testing
   - Device emulation
   - Analysis and documentation
   - Creating test fixtures

### Use Cases

- **Security Testing**: Clone devices to test authentication and pairing mechanisms
- **Device Analysis**: Capture and analyze device profiles for security research
- **Emulation**: Use cloned profiles to emulate devices in controlled environments
- **Documentation**: Export device profiles for security documentation

### Security Considerations

⚠️ **Important**: Bluetooth device cloning should only be performed:
- On devices you own or have explicit permission to test
- In controlled environments for security research
- In compliance with applicable laws and regulations

The cloning feature creates a profile/snapshot of the device's advertisement and service data. It does not:
- Capture encrypted communication
- Break pairing or authentication
- Clone device firmware or software

## License

MIT

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Support

For issues and questions:
- Open an issue on GitHub
- Review the documentation in the `/docs` directory

## Acknowledgments

- Built on Node.js and TypeScript
- Uses [@abandonware/noble](https://github.com/abandonware/noble) for Bluetooth Low Energy support
- Implements autonomic computing principles for self-organization
