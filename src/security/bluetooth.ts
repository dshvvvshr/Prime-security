/**
 * Bluetooth Security Module
 * 
 * Provides Bluetooth device scanning, identification, and cloning capabilities
 * for security testing and analysis.
 */

import * as noble from '@abandonware/noble';
import { auditLogger, AuditLevel } from '../governance/compliance';

export interface BluetoothDevice {
  id: string;
  address: string;
  name?: string;
  rssi: number;
  advertisement: {
    localName?: string;
    txPowerLevel?: number;
    manufacturerData?: Buffer;
    serviceData?: Array<{ uuid: string; data: Buffer }>;
    serviceUuids?: string[];
  };
  connectable: boolean;
  timestamp: Date;
}

export interface DeviceClone {
  deviceId: string;
  address: string;
  name?: string;
  profile: {
    advertisement: {
      localName?: string;
      txPowerLevel?: number;
      manufacturerData?: string; // hex-encoded
      serviceData?: Array<{ uuid: string; data: string }>; // hex-encoded
      serviceUuids?: string[];
    };
    services?: Array<{
      uuid: string;
      characteristics?: Array<{
        uuid: string;
        properties: string[];
      }>;
    }>;
  };
  metadata: {
    clonedAt: Date;
    rssi: number;
    connectable: boolean;
  };
}

export interface ScanOptions {
  duration?: number; // in milliseconds
  serviceUuids?: string[];
  allowDuplicates?: boolean;
}

export interface ScanResult {
  devices: BluetoothDevice[];
  scanDuration: number;
  timestamp: Date;
}

interface NoblePeripheral {
  id: string;
  address?: string;
  rssi: number;
  advertisement?: {
    localName?: string;
    txPowerLevel?: number;
    manufacturerData?: Buffer;
    serviceData?: Array<{ uuid: string; data: Buffer }>;
    serviceUuids?: string[];
  };
  connectable: boolean;
}

/**
 * Bluetooth Scanner and Device Manager
 */
export class BluetoothScanner {
  private discoveredDevices: Map<string, BluetoothDevice> = new Map();
  private scanning: boolean = false;
  private clonedDevices: Map<string, DeviceClone> = new Map();
  private stopScanPromise: Promise<void> | null = null;
  private bluetoothState: string = 'unknown';
  private stateChangeHandler: ((state: string) => void) | null = null;
  private discoverHandler: ((peripheral: NoblePeripheral) => void) | null = null;

  constructor() {
    this.setupNobleListeners();
  }

  /**
   * Initialize Noble event listeners
   */
  private setupNobleListeners(): void {
    this.stateChangeHandler = (state: string) => {
      this.bluetoothState = state;
      auditLogger.log(AuditLevel.INFO, 'bluetooth', 'state-change', {
        state,
      });
    };
    
    this.discoverHandler = (peripheral: NoblePeripheral) => {
      this.handleDeviceDiscovery(peripheral);
    };

    // Initialize state from noble
    this.bluetoothState = noble._state;
    
    noble.on('stateChange', this.stateChangeHandler);
    noble.on('discover', this.discoverHandler);
  }

  /**
   * Remove Noble event listeners
   */
  private removeNobleListeners(): void {
    if (this.stateChangeHandler) {
      noble.removeListener('stateChange', this.stateChangeHandler);
      this.stateChangeHandler = null;
    }
    if (this.discoverHandler) {
      noble.removeListener('discover', this.discoverHandler);
      this.discoverHandler = null;
    }
  }

  /**
   * Handle discovered peripheral
   */
  private handleDeviceDiscovery(peripheral: NoblePeripheral): void {
    const device: BluetoothDevice = {
      id: peripheral.id,
      address: peripheral.address || peripheral.id,
      name: peripheral.advertisement?.localName,
      rssi: peripheral.rssi,
      advertisement: {
        localName: peripheral.advertisement?.localName,
        txPowerLevel: peripheral.advertisement?.txPowerLevel,
        manufacturerData: peripheral.advertisement?.manufacturerData,
        serviceData: peripheral.advertisement?.serviceData,
        serviceUuids: peripheral.advertisement?.serviceUuids,
      },
      connectable: peripheral.connectable,
      timestamp: new Date(),
    };

    this.discoveredDevices.set(device.id, device);

    auditLogger.log(AuditLevel.INFO, 'bluetooth', 'device-discovered', {
      deviceId: device.id,
      name: device.name,
      rssi: device.rssi,
    });
  }

  /**
   * Check if Bluetooth is available and ready
   */
  async isReady(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.bluetoothState === 'poweredOn') {
        resolve(true);
      } else {
        noble.once('stateChange', (state) => {
          resolve(state === 'poweredOn');
        });
      }
    });
  }

  /**
   * Start scanning for Bluetooth devices
   */
  async startScan(options: ScanOptions = {}): Promise<void> {
    const ready = await this.isReady();
    if (!ready) {
      throw new Error('Bluetooth is not available or not powered on');
    }

    if (this.scanning) {
      throw new Error('Scan already in progress');
    }

    this.discoveredDevices.clear();
    this.scanning = true;

    auditLogger.log(AuditLevel.INFO, 'bluetooth', 'scan-start', {
      options,
    });

    const serviceUuids = options.serviceUuids || [];
    const allowDuplicates = options.allowDuplicates || false;

    await noble.startScanningAsync(serviceUuids, allowDuplicates);
  }

  /**
   * Stop scanning for Bluetooth devices
   */
  async stopScan(): Promise<void> {
    // If a stop operation is already in progress, wait for it
    if (this.stopScanPromise) {
      await this.stopScanPromise;
      return;
    }

    if (!this.scanning) {
      return;
    }

    this.stopScanPromise = (async () => {
      try {
        await noble.stopScanningAsync();
        this.scanning = false;

        auditLogger.log(AuditLevel.INFO, 'bluetooth', 'scan-stop', {
          devicesFound: this.discoveredDevices.size,
        });
      } finally {
        this.stopScanPromise = null;
      }
    })();

    await this.stopScanPromise;
  }

  /**
   * Scan for devices and return results
   */
  async scan(options: ScanOptions = {}): Promise<ScanResult> {
    const startTime = Date.now();
    const duration = options.duration || 5000; // Default 5 seconds

    // Start scan without auto-stop duration (we handle it here)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { duration: _duration, ...scanOptions } = options;
    await this.startScan(scanOptions);

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          await this.stopScan();
          const scanDuration = Date.now() - startTime;

          resolve({
            devices: Array.from(this.discoveredDevices.values()),
            scanDuration,
            timestamp: new Date(),
          });
        } catch (error) {
          reject(error);
        }
      }, duration);
    });
  }

  /**
   * Get all discovered devices
   */
  getDiscoveredDevices(): BluetoothDevice[] {
    return Array.from(this.discoveredDevices.values());
  }

  /**
   * Get a specific device by ID
   */
  getDevice(deviceId: string): BluetoothDevice | undefined {
    return this.discoveredDevices.get(deviceId);
  }

  /**
   * Identify a device by gathering detailed information
   */
  async identifyDevice(deviceId: string): Promise<BluetoothDevice | null> {
    const device = this.discoveredDevices.get(deviceId);
    if (!device) {
      auditLogger.log(AuditLevel.WARN, 'bluetooth', 'device-not-found', {
        deviceId,
      });
      return null;
    }

    auditLogger.log(AuditLevel.INFO, 'bluetooth', 'device-identified', {
      deviceId: device.id,
      name: device.name,
      address: device.address,
      serviceUuids: device.advertisement.serviceUuids,
    });

    return device;
  }

  /**
   * Clone a device profile for emulation/testing
   */
  async cloneDevice(deviceId: string): Promise<DeviceClone | null> {
    const device = await this.identifyDevice(deviceId);
    if (!device) {
      return null;
    }

    const clone: DeviceClone = {
      deviceId: device.id,
      address: device.address,
      name: device.name,
      profile: {
        advertisement: {
          localName: device.advertisement.localName,
          txPowerLevel: device.advertisement.txPowerLevel,
          manufacturerData: device.advertisement.manufacturerData?.toString('hex'),
          serviceData: device.advertisement.serviceData?.map(sd => ({
            uuid: sd.uuid,
            data: sd.data.toString('hex'),
          })),
          serviceUuids: device.advertisement.serviceUuids,
        },
        services: [],
      },
      metadata: {
        clonedAt: new Date(),
        rssi: device.rssi,
        connectable: device.connectable,
      },
    };

    this.clonedDevices.set(device.id, clone);

    auditLogger.log(AuditLevel.INFO, 'bluetooth', 'device-cloned', {
      deviceId: device.id,
      name: device.name,
    });

    return clone;
  }

  /**
   * Get all cloned devices
   */
  getClonedDevices(): DeviceClone[] {
    return Array.from(this.clonedDevices.values());
  }

  /**
   * Get a specific cloned device
   */
  getClonedDevice(deviceId: string): DeviceClone | undefined {
    return this.clonedDevices.get(deviceId);
  }

  /**
   * Export a device clone to JSON
   */
  exportClone(deviceId: string): string | null {
    const clone = this.clonedDevices.get(deviceId);
    if (!clone) {
      return null;
    }

    return JSON.stringify(clone, null, 2);
  }

  /**
   * Import a device clone from JSON
   */
  importClone(cloneJson: string): DeviceClone {
    let clone: unknown;
    
    try {
      clone = JSON.parse(cloneJson);
    } catch (error) {
      auditLogger.log(AuditLevel.ERROR, 'bluetooth', 'clone-import-failed', {
        error: 'Invalid JSON format',
      });
      throw new Error('Invalid JSON format for device clone');
    }

    // Type guard to check if clone has required properties
    const parsedClone = clone as Record<string, unknown>;
    
    // Validate required fields
    if (!parsedClone.deviceId || !parsedClone.address || !parsedClone.profile || !parsedClone.metadata) {
      auditLogger.log(AuditLevel.ERROR, 'bluetooth', 'clone-import-failed', {
        error: 'Missing required fields in device clone',
      });
      throw new Error('Missing required fields in device clone');
    }

    // Normalize Date field - JSON.parse returns string for Date
    const metadata = parsedClone.metadata as Record<string, unknown>;
    if (metadata.clonedAt) {
      metadata.clonedAt = new Date(metadata.clonedAt as string);
    }

    const normalizedClone = parsedClone as unknown as DeviceClone;
    this.clonedDevices.set(normalizedClone.deviceId, normalizedClone);

    auditLogger.log(AuditLevel.INFO, 'bluetooth', 'clone-imported', {
      deviceId: normalizedClone.deviceId,
      name: normalizedClone.name,
    });

    return normalizedClone;
  }

  /**
   * Clear all discovered devices
   */
  clearDiscovered(): void {
    this.discoveredDevices.clear();
    auditLogger.log(AuditLevel.INFO, 'bluetooth', 'cleared-discovered', {});
  }

  /**
   * Clear all cloned devices
   */
  clearClones(): void {
    this.clonedDevices.clear();
    auditLogger.log(AuditLevel.INFO, 'bluetooth', 'cleared-clones', {});
  }

  /**
   * Get scanner status
   */
  getStatus(): {
    scanning: boolean;
    bluetoothState: string;
    discoveredCount: number;
    clonedCount: number;
  } {
    return {
      scanning: this.scanning,
      bluetoothState: this.bluetoothState,
      discoveredCount: this.discoveredDevices.size,
      clonedCount: this.clonedDevices.size,
    };
  }
}

// Export singleton instance - will be created lazily
let _bluetoothScanner: BluetoothScanner | null = null;

export const bluetoothScanner = {
  get instance(): BluetoothScanner {
    if (!_bluetoothScanner) {
      _bluetoothScanner = new BluetoothScanner();
    }
    return _bluetoothScanner;
  },
  reset(): void {
    if (_bluetoothScanner) {
      _bluetoothScanner['removeNobleListeners']();
    }
    _bluetoothScanner = null;
  }
};
