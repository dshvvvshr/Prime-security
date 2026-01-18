/**
 * Bluetooth Security Module
 * 
 * Provides Bluetooth device scanning, identification, and cloning capabilities
 * for security testing and analysis.
 */

import * as noble from '@abandonware/noble';
import { hash } from './crypto';
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

  constructor() {
    this.setupNobleListeners();
  }

  /**
   * Initialize Noble event listeners
   */
  private setupNobleListeners(): void {
    noble.on('stateChange', (state) => {
      auditLogger.log(AuditLevel.INFO, 'bluetooth', 'state-change', {
        state,
      });
    });

    noble.on('discover', (peripheral) => {
      this.handleDeviceDiscovery(peripheral);
    });
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
   * Note: noble._state is the documented public API for checking state
   */
  async isReady(): Promise<boolean> {
    return new Promise((resolve) => {
      // noble._state is the public API (despite the underscore)
      if (noble._state === 'poweredOn') {
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

    if (options.duration) {
      setTimeout(async () => {
        try {
          await this.stopScan();
        } catch (error) {
          auditLogger.log(AuditLevel.WARN, 'bluetooth', 'scan-stop-error', {
            error: (error as Error).message,
          });
        }
      }, options.duration);
    }
  }

  /**
   * Stop scanning for Bluetooth devices
   */
  async stopScan(): Promise<void> {
    if (!this.scanning) {
      return;
    }

    await noble.stopScanningAsync();
    this.scanning = false;

    auditLogger.log(AuditLevel.INFO, 'bluetooth', 'scan-stop', {
      devicesFound: this.discoveredDevices.size,
    });
  }

  /**
   * Scan for devices and return results
   */
  async scan(options: ScanOptions = {}): Promise<ScanResult> {
    const startTime = Date.now();
    const duration = options.duration || 5000; // Default 5 seconds

    await this.startScan({ ...options, duration });

    return new Promise((resolve) => {
      setTimeout(async () => {
        await this.stopScan();
        const scanDuration = Date.now() - startTime;
        
        resolve({
          devices: Array.from(this.discoveredDevices.values()),
          scanDuration,
          timestamp: new Date(),
        });
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
      cloneId: hash(device.id + Date.now().toString()).substring(0, 16),
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
    let clone: DeviceClone;
    
    try {
      clone = JSON.parse(cloneJson) as DeviceClone;
    } catch (error) {
      auditLogger.log(AuditLevel.ERROR, 'bluetooth', 'clone-import-failed', {
        error: 'Invalid JSON format',
      });
      throw new Error('Invalid JSON format for device clone');
    }

    // Validate required fields
    if (!clone.deviceId || !clone.address || !clone.profile || !clone.metadata) {
      auditLogger.log(AuditLevel.ERROR, 'bluetooth', 'clone-import-failed', {
        error: 'Missing required fields in device clone',
      });
      throw new Error('Missing required fields in device clone');
    }

    this.clonedDevices.set(clone.deviceId, clone);

    auditLogger.log(AuditLevel.INFO, 'bluetooth', 'clone-imported', {
      deviceId: clone.deviceId,
      name: clone.name,
    });

    return clone;
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
   * Note: noble._state is the documented public API
   */
  getStatus(): {
    scanning: boolean;
    bluetoothState: string;
    discoveredCount: number;
    clonedCount: number;
  } {
    return {
      scanning: this.scanning,
      bluetoothState: noble._state, // Public API despite underscore prefix
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
    _bluetoothScanner = null;
  }
};
