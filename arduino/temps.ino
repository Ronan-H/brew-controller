/*
 * Rui Santos
 * Complete Project Details https://randomnerdtutorials.com
 */

#include <OneWire.h>
#include <DallasTemperature.h>

// Data wire is plugged into port 4 on the Arduino
#define ONE_WIRE_BUS 4
// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);

// Pass our oneWire reference to Dallas Temperature. 
DallasTemperature sensors(& oneWire);

// Vessel (no tape) - 28FF641F69FAB5BC
DeviceAddress vesselAddr  = { 0x28, 0xFF, 0x64, 0x1F, 0x69, 0xFA, 0xB5, 0xBC };
// Room (red tape) - 28FF641F69CB2A05
DeviceAddress roomAddr = { 0x28, 0xFF, 0x64, 0x1F, 0x69, 0xCB, 0x2A, 0x05 };

void setup(void) {
  // start serial port
  Serial.begin(9600);

  // Start up the library
  sensors.begin();
}

void loop(void) {
  sensors.requestTemperatures(); // Send the command to get temperatures

  // Send the vessel & room sensor temps over serial
  float vesselTemp = sensors.getTempC(vesselAddr);
  float roomTemp = sensors.getTempC(roomAddr);
  Serial.print(vesselTemp);
  Serial.print(',');
  Serial.print(roomTemp);

  delay(10000);
}
