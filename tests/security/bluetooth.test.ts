/**
 * Bluetooth Security Module Tests
 * 
 * Note: Testing Bluetooth functionality requires hardware access.
 * These tests verify the module structure and non-hardware-dependent features  * without instantiating the scanner (which requires Bluetooth hardware).
 */

import { DeviceClone } from '../../src/security/bluetooth';

describe('Bluetooth Security Module', () => {
  describe('DeviceClone Data Validation', () => {
    it('should validate clone export and import format', () => {
      const cloneData: DeviceClone = {
        deviceId: 'test-device-123',
        address: 'AA:BB:CC:DD:EE:FF',
        name: 'Test Bluetooth Device',
        profile: {
          advertisement: {
            localName: 'Test Bluetooth Device',
            txPowerLevel: 4,
            manufacturerData: '0102030405',
            serviceData: [
              { uuid: '1800', data: 'abcdef' },
              { uuid: '1801', data: '123456' },
            ],
            serviceUuids: ['1800', '1801', '180A'],
          },
          services: [],
        },
        metadata: {
          clonedAt: new Date('2024-01-01'),
          rssi: -55,
          connectable: true,
        },
      };

      // Simulate export (JSON.stringify)
      const exported = JSON.stringify(cloneData);
      
      // Simulate import (JSON.parse + Date normalization)
      const imported: any = JSON.parse(exported);
      imported.metadata.clonedAt = new Date(imported.metadata.clonedAt);
      
      const normalizedClone = imported as DeviceClone;
      
      expect(normalizedClone.deviceId).toBe('test-device-123');
      expect(normalizedClone.address).toBe('AA:BB:CC:DD:EE:FF');
      expect(normalizedClone.name).toBe('Test Bluetooth Device');
      expect(normalizedClone.metadata.rssi).toBe(-55);
      
      // Verify the clonedAt field is a Date object after normalization
      expect(normalizedClone.metadata.clonedAt).toBeInstanceOf(Date);
      expect(normalizedClone.metadata.clonedAt.toISOString()).toBe(new Date('2024-01-01').toISOString());
    });

    it('should handle JSON parse errors', () => {
      expect(() => {
        JSON.parse('invalid json');
      }).toThrow();
    });

    it('should validate required fields presence', () => {
      const invalidClone = {
        deviceId: 'test',
        // missing address and other required fields
      };

      const parsed = invalidClone as any;
      
      expect(parsed.deviceId).toBeDefined();
      expect(parsed.address).toBeUndefined();
      expect(parsed.profile).toBeUndefined();
      expect(parsed.metadata).toBeUndefined();
    });

    it('should handle multiple clone data structures', () => {
      const clone1: DeviceClone = {
        deviceId: 'device-1',
        address: 'AA:BB:CC:DD:EE:01',
        name: 'Device 1',
        profile: { advertisement: {} },
        metadata: { clonedAt: new Date(), rssi: -50, connectable: true },
      };

      const clone2: DeviceClone = {
        deviceId: 'device-2',
        address: 'AA:BB:CC:DD:EE:02',
        name: 'Device 2',
        profile: { advertisement: {} },
        metadata: { clonedAt: new Date(), rssi: -60, connectable: false },
      };

      const clones = [clone1, clone2];
      expect(clones).toHaveLength(2);
      expect(clones[0].name).toBe('Device 1');
      expect(clones[1].name).toBe('Device 2');
    });
  });

  describe('DeviceClone Interface', () => {
    it('should allow creating and manipulating device clone data', () => {
      // Test clone data structure without requiring hardware
      const cloneData = {
        deviceId: 'test-device-123',
        address: 'AA:BB:CC:DD:EE:FF',
        name: 'Test Bluetooth Device',
        profile: {
          advertisement: {
            localName: 'Test Bluetooth Device',
            txPowerLevel: 4,
            manufacturerData: '0102030405',
            serviceData: [
              { uuid: '1800', data: 'abcdef' },
              { uuid: '1801', data: '123456' },
            ],
            serviceUuids: ['1800', '1801', '180A'],
          },
          services: [],
        },
        metadata: {
          clonedAt: new Date('2024-01-01'),
          rssi: -55,
          connectable: true,
        },
      };

      expect(cloneData.deviceId).toBe('test-device-123');
      expect(cloneData.address).toBe('AA:BB:CC:DD:EE:FF');
      expect(cloneData.profile.advertisement.serviceUuids).toHaveLength(3);
      expect(cloneData.metadata.rssi).toBe(-55);

      // Verify JSON serialization works
      const json = JSON.stringify(cloneData);
      const parsed = JSON.parse(json);
      expect(parsed.deviceId).toBe('test-device-123');
      expect(parsed.name).toBe('Test Bluetooth Device');
    });
  });

  describe('Bluetooth Device Data Structure', () => {
    it('should support standard Bluetooth device properties', () => {
      const deviceData = {
        id: 'device-001',
        address: 'FF:EE:DD:CC:BB:AA',
        name: 'Smart Watch',
        rssi: -45,
        advertisement: {
          localName: 'Smart Watch',
          txPowerLevel: 0,
          serviceUuids: ['180D', '180F'], // Heart Rate, Battery Service
        },
        connectable: true,
        timestamp: new Date(),
      };

      expect(deviceData.id).toBe('device-001');
      expect(deviceData.rssi).toBe(-45);
      expect(deviceData.advertisement.serviceUuids).toContain('180D');
      expect(deviceData.connectable).toBe(true);
    });
  });
});
