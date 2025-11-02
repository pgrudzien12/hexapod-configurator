# Hexapod Robot Configurator

A Betaflight-inspired web-based configuration portal for tuning and controlling a hexapod robot. This configurator provides real-time parameter adjustment, 3D visualizations, and comprehensive telemetry monitoring for a 6-legged walking robot powered by ESP32.

## Overview

This project is a modern web interface for configuring and monitoring a hexapod robot, similar to how Betaflight Configurator works for drones. The portal communicates with the robot's ESP32 controller via WebSocket, allowing real-time tuning of servo parameters, gait patterns, motion control, and sensor calibration.

**Note:** This repository contains only the web portal. The robot firmware (ESP32) and backend API are handled separately.

## Features

### 🦿 Leg Configuration
- Individual servo tuning for all 18 servos (3 per leg × 6 legs)
- Real-time 3D leg visualization
- Servo trim, min/max limits, and speed adjustment
- Per-leg configuration with coxa, femur, and tibia joint control

### 🚶 Motion Control
- Multiple gait pattern selection (Tripod, Wave, Ripple)
- Speed and stride length adjustment
- Body height and rotation control
- Animated gait visualization showing stance/swing phases

### 🎮 Controller Settings
- FlySky FS-i6X and ESP-NOW controller support
- Channel mapping and calibration
- Real-time input monitoring with visual feedback
- Deadzone and expo curve configuration

### 📡 Sensors & IMU
- MPU6050 IMU calibration wizard
- Real-time attitude indicator (pitch/roll/yaw)
- Touch sensor configuration for all 6 legs
- Gyro and accelerometer tuning

### ⚙️ System Parameters
- Motion limits and safety settings
- Power management and battery monitoring
- Failsafe configuration
- Emergency stop settings

### 📊 Telemetry & Monitoring
- Real-time 3D hexapod visualization
- System health metrics (CPU, memory, temperature)
- Performance monitoring and diagnostics
- Live servo position feedback

### 💾 Configuration Management
- Save/load configuration profiles
- Export/import settings as JSON
- Factory reset option
- Configuration backup and restore

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **3D Visualization:** Custom Canvas-based rendering
- **Real-time Communication:** WebSocket (simulated for development)
- **State Management:** React Context API

## Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Modern web browser with WebSocket support

### Setup

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd hexapod-configurator
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

\`\`\`bash
npm run build
npm run start
\`\`\`

Or deploy directly to Vercel:

\`\`\`bash
vercel deploy
\`\`\`

## Usage

### Development Mode

In development mode, the configurator uses a simulated WebSocket connection with mock data. This allows you to:
- Test all UI features without a physical robot
- Develop and debug configuration interfaces
- Visualize gait patterns and servo movements

Toggle the connection status in the sidebar to simulate connect/disconnect states.

### Production Mode

To connect to a real hexapod robot:

1. Ensure your ESP32 is running the hexapod firmware with WebSocket server
2. Update the WebSocket URL in `lib/websocket-context.tsx`:
\`\`\`typescript
const ws = new WebSocket('ws://YOUR_ESP32_IP:81');
\`\`\`
3. Connect to the same network as your robot
4. The configurator will automatically establish connection

## Project Structure

\`\`\`
├── app/                      # Next.js app router pages
│   ├── page.tsx             # Leg Configuration (home)
│   ├── motion/              # Motion Control tab
│   ├── controller/          # Controller Settings tab
│   ├── sensors/             # Sensors & IMU tab
│   ├── system/              # System Parameters tab
│   ├── telemetry/           # Telemetry & Monitoring tab
│   └── config/              # Configuration Management tab
├── components/
│   ├── configurator/        # Configuration panel components
│   ├── dashboard/           # Layout and navigation components
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── websocket-context.tsx  # WebSocket communication
│   ├── config-context.tsx     # Configuration state management
│   └── utils.ts               # Utility functions
└── types/                   # TypeScript type definitions
\`\`\`

## Configuration

### WebSocket Protocol

The configurator expects JSON messages in the following format:

\`\`\`json
{
  "type": "telemetry",
  "data": {
    "servos": [/* 18 servo positions */],
    "imu": { "roll": 0, "pitch": 0, "yaw": 0 },
    "battery": { "voltage": 7.4, "current": 2.5 },
    "sensors": { "touch": [false, false, false, false, false, false] }
  }
}
\`\`\`

### Environment Variables

No environment variables are required for basic operation. For production deployment with custom WebSocket endpoints, you can add:

\`\`\`env
NEXT_PUBLIC_WEBSOCKET_URL=ws://your-robot-ip:81
\`\`\`

## Robot Hardware

This configurator is designed for a hexapod robot with:
- 18 servo motors (3 per leg: coxa, femur, tibia)
- ESP32 microcontroller
- MPU6050 IMU sensor
- 6 touch sensors (one per leg)
- FlySky FS-i6X receiver or ESP-NOW controller
- 2S LiPo battery (7.4V)

## Future Enhancements

- [ ] Inverse kinematics visualization
- [ ] Gait pattern editor with custom sequences
- [ ] Data logging and playback
- [ ] Firmware update via web interface
- [ ] Multi-robot support
- [ ] Mobile app version
- [ ] Advanced PID tuning interface

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use this project for your own hexapod robots!

## Acknowledgments

- Inspired by [Betaflight Configurator](https://github.com/betaflight/betaflight-configurator)
- Built with [Next.js](https://nextjs.org/) and [shadcn/ui](https://ui.shadcn.com/)
- Dashboard template based on M.O.N.K.Y design system
