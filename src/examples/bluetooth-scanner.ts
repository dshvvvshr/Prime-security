/**
 * Bluetooth Scanner Example
 * 
 * This example demonstrates how to use the Bluetooth scanning and cloning
 * functionality in the Prime Security framework.
 * 
 * NOTE: This requires Bluetooth hardware to run successfully.
 */

import { bluetooth, PrimeSecurity } from '../index';

async function main() {
  console.log('Prime Security - Bluetooth Scanner Example\n');
  
  // Initialize the Prime Security system
  const system = new PrimeSecurity();
  await system.initialize();
  await system.start();
  
  // Get the Bluetooth scanner instance
  const scanner = bluetooth.bluetoothScanner.instance;
  
  // Check if Bluetooth is available
  const isReady = await scanner.isReady();
  
  if (!isReady) {
    console.log('❌ Bluetooth is not available on this system');
    await system.stop();
    return;
  }
  
  console.log('✅ Bluetooth is ready\n');
  
  // Scan for devices (10 seconds)
  console.log('🔍 Scanning for Bluetooth devices...');
  const result = await scanner.scan({ 
    duration: 10000,
    allowDuplicates: false 
  });
  
  console.log(`\n📡 Found ${result.devices.length} device(s):\n`);
  
  // Display discovered devices
  result.devices.forEach((device, index) => {
    console.log(`Device ${index + 1}:`);
    console.log(`  ID: ${device.id}`);
    console.log(`  Name: ${device.name || 'Unknown'}`);
    console.log(`  Address: ${device.address}`);
    console.log(`  RSSI: ${device.rssi} dBm`);
    console.log(`  Connectable: ${device.connectable}`);
    
    if (device.advertisement.serviceUuids && device.advertisement.serviceUuids.length > 0) {
      console.log(`  Services: ${device.advertisement.serviceUuids.join(', ')}`);
    }
    
    if (device.advertisement.manufacturerData) {
      console.log(`  Manufacturer Data: ${device.advertisement.manufacturerData.toString('hex')}`);
    }
    
    console.log('');
  });
  
  // Clone the first device if available
  if (result.devices.length > 0) {
    const firstDevice = result.devices[0];
    console.log(`\n🔄 Cloning device: ${firstDevice.name || firstDevice.id}`);
    
    const clone = await scanner.cloneDevice(firstDevice.id);
    
    if (clone) {
      console.log('✅ Device cloned successfully!');
      console.log(`  Clone ID: ${clone.deviceId}`);
      console.log(`  Profile includes:`);
      console.log(`    - Advertisement data`);
      console.log(`    - Service UUIDs: ${clone.profile.advertisement.serviceUuids?.length || 0}`);
      console.log(`    - Metadata (RSSI, connectable, timestamp)`);
      
      // Export the clone
      const exported = scanner.exportClone(firstDevice.id);
      if (exported) {
        console.log(`\n📄 Exported clone (first 200 chars):`);
        console.log(exported.substring(0, 200) + '...');
      }
    }
  }
  
  // Display scanner status
  console.log('\n📊 Scanner Status:');
  const status = scanner.getStatus();
  console.log(`  Bluetooth State: ${status.bluetoothState}`);
  console.log(`  Discovered Devices: ${status.discoveredCount}`);
  console.log(`  Cloned Devices: ${status.clonedCount}`);
  console.log(`  Scanning: ${status.scanning}`);
  
  // Clean up
  console.log('\n🧹 Cleaning up...');
  await system.stop();
  console.log('✅ Done!');
}

// Run the example
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}

export { main };
